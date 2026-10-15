/**
 * relayClient.ts: a read-only nostr client over plain WebSockets.
 *
 * The only frames this module can send are REQ, COUNT and CLOSE: `send`
 * takes nothing else, so publishing (EVENT) or authenticating (AUTH) cannot
 * be expressed here. An AUTH challenge from a relay is noted and ignored, and
 * a subscription the relay closes with `auth-required` marks that relay as
 * needing sign-in, which this site never does.
 *
 * One socket per relay, shared by every query. A relay that does not open
 * within CONNECT_MS, or that drops, is reported and does not hold up the
 * others: each query resolves on its own deadline whatever happens.
 */

export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export type Filter = {
  ids?: string[]
  authors?: string[]
  kinds?: number[]
  since?: number
  until?: number
  limit?: number
} & { [tag: `#${string}`]: string[] }

export type RelayState = 'idle' | 'connecting' | 'open' | 'slow' | 'auth-required' | 'unreachable'

export interface RelayStatus {
  url: string
  state: RelayState
  /** Events this relay has sent this session. */
  events: number
  /** Whether the relay answered a NIP-45 COUNT. */
  count: boolean | null
}

/** How long a relay gets to open its socket. */
const CONNECT_MS = 4000
/** How long a one-shot query stays open without an EOSE. */
const QUERY_MS = 9000
/** How long a COUNT waits for its answer. */
const COUNT_MS = 5000
/** After a relay fails to open, queries skip it for this long instead of each trying again. */
const UNREACHABLE_COOLDOWN_MS = 60000

type Verb = 'REQ' | 'COUNT' | 'CLOSE'

interface Sub {
  onEvent?: (ev: NostrEvent) => void
  onEose?: () => void
  onClosed?: (reason: string) => void
  onCount?: (n: number) => void
}

let subSeq = 0
const nextSubId = (): string => `sl${(++subSeq).toString(36)}`

/** Basic shape check: a relay is not trusted to send well-formed events. */
function looksLikeEvent(ev: unknown): ev is NostrEvent {
  const e = ev as NostrEvent
  return !!e && typeof e.id === 'string' && typeof e.pubkey === 'string' && typeof e.created_at === 'number'
    && typeof e.kind === 'number' && Array.isArray(e.tags) && typeof e.content === 'string'
}

class RelayConn {
  readonly url: string
  state: RelayState = 'idle'
  events = 0
  countSupported: boolean | null = null
  private ws: WebSocket | null = null
  private opening: Promise<boolean> | null = null
  private failedAt = 0
  private subs = new Map<string, Sub>()
  private onChange: () => void

  constructor(url: string, onChange: () => void) {
    this.url = url
    this.onChange = onChange
  }

  private setState(s: RelayState): void {
    if (this.state === s) return
    // auth-required is sticky: a reconnect does not change the relay's policy.
    if (this.state === 'auth-required' && s === 'open') return
    this.state = s
    this.onChange()
  }

  /** A read on an open socket ran out its deadline: the relay is up but not answering. */
  markSlow(): void {
    if (this.state === 'open') this.setState('slow')
  }

  /** Open the socket, or reuse it. Resolves false when the relay is unreachable. */
  open(): Promise<boolean> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return Promise.resolve(true)
    if (this.opening) return this.opening
    if (this.state === 'unreachable' && Date.now() - this.failedAt < UNREACHABLE_COOLDOWN_MS) return Promise.resolve(false)
    this.setState('connecting')
    this.opening = new Promise<boolean>((resolve) => {
      let ws: WebSocket
      try { ws = new WebSocket(this.url) } catch { this.setState('unreachable'); resolve(false); return }
      this.ws = ws
      const timer = setTimeout(() => { try { ws.close() } catch { /* closing */ } fail() }, CONNECT_MS)
      const fail = (): void => {
        clearTimeout(timer)
        this.ws = null
        this.opening = null
        this.failedAt = Date.now()
        if (this.state !== 'auth-required') this.setState('unreachable')
        for (const [, sub] of this.subs) sub.onClosed?.('unreachable')
        this.subs.clear()
        resolve(false)
      }
      ws.onopen = () => { clearTimeout(timer); this.opening = null; this.setState('open'); resolve(true) }
      ws.onerror = () => { /* onclose follows */ }
      ws.onclose = () => { if (this.opening) fail(); else this.dropped() }
      ws.onmessage = (m) => this.receive(m.data)
    })
    return this.opening
  }

  /** The socket closed after it was open: every open subscription ends. */
  private dropped(): void {
    this.ws = null
    if (this.state !== 'auth-required') this.setState('unreachable')
    for (const [, sub] of this.subs) sub.onClosed?.('dropped')
    this.subs.clear()
  }

  /** The only way out of this module: REQ, COUNT or CLOSE, nothing else. */
  private send(verb: Verb, id: string, filter?: Filter): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify(filter ? [verb, id, filter] : [verb, id]))
  }

  private receive(data: unknown): void {
    let msg: unknown[]
    try { msg = JSON.parse(String(data)) } catch { return }
    if (!Array.isArray(msg)) return
    const [type, id] = msg as [string, string]
    const sub = typeof id === 'string' ? this.subs.get(id) : undefined
    if (this.state === 'slow' && type !== 'AUTH' && type !== 'NOTICE') this.setState('open')
    if (type === 'EVENT' && sub && looksLikeEvent(msg[2])) { this.events++; sub.onEvent?.(msg[2]) }
    else if (type === 'EOSE' && sub) sub.onEose?.()
    else if (type === 'COUNT' && sub) {
      const n = (msg[2] as { count?: unknown } | undefined)?.count
      if (typeof n === 'number') { this.countSupported = true; sub.onCount?.(n) }
    } else if (type === 'CLOSED' && sub) {
      const reason = String(msg[2] ?? '')
      if (/^auth-required/i.test(reason)) this.setState('auth-required')
      this.subs.delete(id)
      sub.onClosed?.(reason)
    }
    // 'AUTH' challenges and NOTICEs are deliberately ignored.
  }

  /** Start a subscription; returns its close function. */
  async subscribe(filter: Filter, sub: Sub): Promise<() => void> {
    const ok = await this.open()
    if (!ok) { sub.onClosed?.('unreachable'); return () => {} }
    const id = nextSubId()
    this.subs.set(id, sub)
    this.send('REQ', id, filter)
    return () => {
      if (!this.subs.delete(id)) return
      this.send('CLOSE', id)
    }
  }

  /** NIP-45 COUNT; resolves null when the relay does not answer one. */
  async count(filter: Filter): Promise<number | null> {
    if (this.countSupported === false) return null
    const ok = await this.open()
    if (!ok) return null
    return new Promise((resolve) => {
      const id = nextSubId()
      const done = (n: number | null): void => {
        clearTimeout(timer)
        this.subs.delete(id)
        if (n === null && this.countSupported === null) this.countSupported = false
        resolve(n)
      }
      const timer = setTimeout(() => done(null), COUNT_MS)
      this.subs.set(id, { onCount: (n) => done(n), onClosed: () => done(null) })
      this.send('COUNT', id, filter)
    })
  }
}

export type QueryEnd = 'eose' | 'closed' | 'timeout' | 'unreachable' | 'auth-required'

export interface QueryResult {
  events: NostrEvent[]
  end: QueryEnd
}

/** All the relay connections of this page, and who wants to hear about their state. */
class Pool {
  private conns = new Map<string, RelayConn>()
  private listeners = new Set<() => void>()

  private conn(url: string): RelayConn {
    let c = this.conns.get(url)
    if (!c) {
      c = new RelayConn(url, () => this.listeners.forEach((l) => l()))
      this.conns.set(url, c)
    }
    return c
  }

  onStatus(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  status(urls: readonly string[]): RelayStatus[] {
    return urls.map((url) => {
      const c = this.conns.get(url)
      return { url, state: c?.state ?? 'idle', events: c?.events ?? 0, count: c?.countSupported ?? null }
    })
  }

  /** Whether a relay is worth asking right now. */
  usable(url: string): boolean {
    const s = this.conns.get(url)?.state
    return s !== 'auth-required'
  }

  /** A one-shot read: every event until EOSE, a close, or the deadline. */
  query(url: string, filter: Filter, timeoutMs = QUERY_MS): Promise<QueryResult> {
    const c = this.conn(url)
    if (c.state === 'auth-required') return Promise.resolve({ events: [], end: 'auth-required' })
    return new Promise((resolve) => {
      const events: NostrEvent[] = []
      let close: (() => void) | null = null
      let settled = false
      const finish = (end: QueryEnd): void => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        close?.()
        resolve({ events, end })
      }
      const timer = setTimeout(() => { if (events.length === 0) c.markSlow(); finish('timeout') }, CONNECT_MS + timeoutMs)
      c.subscribe(filter, {
        onEvent: (ev) => events.push(ev),
        onEose: () => finish('eose'),
        onClosed: (reason) => finish(reason === 'unreachable' || reason === 'dropped' ? 'unreachable' : /^auth-required/i.test(reason) ? 'auth-required' : 'closed'),
      }).then((fn) => { close = fn; if (settled) fn() })
    })
  }

  /**
   * A paged read, newest first, following `until` back while each page comes
   * back full. Stops after `maxPages`; `capped` says there may be more.
   */
  async queryPaged(url: string, filter: Filter, maxPages: number): Promise<{ events: NostrEvent[]; end: QueryEnd; capped: boolean }> {
    const all: NostrEvent[] = []
    let until = filter.until
    const limit = filter.limit ?? 500
    for (let page = 0; page < maxPages; page++) {
      const res = await this.query(url, { ...filter, ...(until !== undefined ? { until } : {}) })
      all.push(...res.events)
      if (res.end !== 'eose' || res.events.length < limit) return { events: all, end: res.end, capped: false }
      const oldest = Math.min(...res.events.map((e) => e.created_at))
      until = oldest - 1
    }
    return { events: all, end: 'eose', capped: true }
  }

  count(url: string, filter: Filter): Promise<number | null> {
    const c = this.conn(url)
    if (c.state === 'auth-required') return Promise.resolve(null)
    return c.count(filter)
  }

  /** A live subscription; the returned function closes it. Reopens after a drop, gently. */
  live(url: string, filter: () => Filter, onEvent: (ev: NostrEvent) => void): () => void {
    let stopped = false
    let close: (() => void) | null = null
    let retry: ReturnType<typeof setTimeout> | null = null
    let backoff = 15000
    const start = async (): Promise<void> => {
      if (stopped) return
      const c = this.conn(url)
      if (c.state === 'auth-required') return
      close = await c.subscribe(filter(), {
        onEvent: (ev) => { backoff = 15000; onEvent(ev) },
        onClosed: (reason) => {
          close = null
          if (stopped || /^auth-required/i.test(reason)) return
          retry = setTimeout(start, backoff)
          backoff = Math.min(backoff * 2, 5 * 60000)
        },
      })
      if (stopped) close()
    }
    void start()
    return () => {
      stopped = true
      if (retry) clearTimeout(retry)
      close?.()
    }
  }
}

/** The page's one pool. */
export const pool = new Pool()

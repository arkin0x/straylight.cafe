/**
 * cyberspaceRelay.ts — authenticated reads from wss://cyberspace.nostr1.com.
 *
 * The official relay requires NIP-42 auth for everything now, and answers an
 * unauthenticated REQ by closing it without an event or a notice, so a plain
 * query comes back empty. This module answers the relay's challenge up front
 * with a throwaway key generated once per page load (the same way ONOSENDAI
 * spawns), then runs queries over subscribeEose, which can answer any further
 * auth-required close via onauth. Pattern proven by onosendai-v2 src/lib/relay.ts.
 */

import { SimplePool, finalizeEvent, generateSecretKey } from 'nostr-tools'
import type { EventTemplate } from 'nostr-tools'
import type { Event } from 'nostr-tools'

export const CYBERSPACE_RELAY = 'wss://cyberspace.nostr1.com'

/** How long a one-shot query waits before giving up. */
const MAX_WAIT_MS = 6000

let pool: SimplePool | null = null
const sk = generateSecretKey()

/** Sign a relay NIP-42 challenge with this page's throwaway identity. */
function authSign(template: EventTemplate) {
  return Promise.resolve(finalizeEvent(template, sk))
}

/** Pool singleton so repeated polls ride one connection. */
function getPool(): SimplePool {
  if (!pool) pool = new SimplePool()
  return pool
}

interface AuthRelay {
  challenge?: string
  auth(sign: typeof authSign): Promise<unknown>
}

const authedFor = new Map<string, string>()

/**
 * Open the relay connection and answer its challenge before any REQ.
 * relay.auth caches per challenge, so once authed this costs nothing;
 * a reconnect brings a fresh challenge and we re-answer.
 */
async function ensureAuthed(): Promise<void> {
  try {
    const relay = (await getPool().ensureRelay(CYBERSPACE_RELAY)) as unknown as AuthRelay
    for (let i = 0; i < 25 && !relay.challenge; i++) await new Promise((r) => setTimeout(r, 40))
    if (!relay.challenge || authedFor.get(CYBERSPACE_RELAY) === relay.challenge) return
    await relay.auth(authSign)
    authedFor.set(CYBERSPACE_RELAY, relay.challenge)
  } catch {
    /* relay down; the query below will surface the failure */
  }
}

/**
 * One-shot query against the cyberspace relay, via subscribeEose rather than
 * querySync because only the former accepts onauth: if the relay closes the
 * subscription with auth-required mid-flight we answer and keep going.
 */
export function queryCyberspace(filter: Parameters<SimplePool['subscribeEose']>[1]): Promise<Event[]> {
  return new Promise((resolve) => {
    const events = new Map<string, Event>()
    let settled = false
    const done = (): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try { sub.close() } catch { /* already closed */ }
      resolve([...events.values()])
    }
    const timer = setTimeout(done, MAX_WAIT_MS + 1500)
    const sub = getPool().subscribeEose([CYBERSPACE_RELAY], filter, {
      onevent: (e) => events.set(e.id, e),
      onclose: done,
      onauth: authSign,
      maxWait: MAX_WAIT_MS,
    })
  })
}

/** Pre-auth the connection; call before issuing queries. */
export function connectCyberspace(): Promise<void> {
  return ensureAuthed()
}

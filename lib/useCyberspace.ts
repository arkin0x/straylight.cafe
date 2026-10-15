'use client'

/**
 * useCyberspace.ts: loads the world once per page, keeps it live, and hands
 * React the stats.
 *
 * Every read is bounded: movement for the last 7 days (at most 4 pages of
 * 500 per relay), rides and bags on record (1 and 2 pages), public objects
 * (2 pages of 200 per relay), profiles only for the avatars and authors
 * shown. Relays are asked in parallel and each paints as it answers, so a
 * slow or dead one never holds up the rest. After the first load one live
 * subscription per relay (new events only, `since` now) keeps it current.
 *
 * The world is a module singleton, so remounting reads nothing again. The
 * computed stats are kept in sessionStorage too, so a reload in the same tab
 * paints the last numbers at once while the relays are asked afresh.
 */

import { useEffect, useState, useSyncExternalStore } from 'react'
import { verifyEvent } from 'nostr-tools/pure'
import { pool, type NostrEvent, type RelayStatus } from './relayClient'
import { ALL_RELAYS, CYBERSPACE_RELAYS, PROFILE_RELAYS, SHARD_RELAYS } from './relays'
import {
  computeStats, emptyWorld, ingest, liveObjects,
  KIND_BAG, KIND_DELETION, KIND_MOVE, KIND_OBJECT, KIND_PROFILE, WEEK,
  type Coverage, type Stats,
} from './world'
import type { FeedObject } from 'sno-core/feed'

export type Phase = 'loading' | 'ready'

export interface Snapshot {
  phase: Phase
  stats: Stats | null
  /** The newest public objects, for the shard feed. */
  shards: FeedObject[]
  /** Profile names for the shown shards' authors. */
  names: Map<string, string>
  coverage: Coverage
  /** Movement events on record: the largest NIP-45 COUNT any relay reported, or the distinct moves read, whichever is more. */
  movesOnRecord: number | null
  relays: RelayStatus[]
  /** When the stats were last recomputed (unix seconds). */
  updatedAt: number
  /** True while the numbers on screen come from this tab's earlier visit. */
  fromCache: boolean
  /** True once a live subscription is open on at least one relay. */
  live: boolean
}

const SHARDS_SHOWN = 12
const CACHE_KEY = 'straylight:stats:v1'
const CACHE_MAX_AGE = 30 * 60

const world = emptyWorld()
const coverage: Coverage = { movesCapped: false, bagsCapped: false, objectsCapped: false, ridesCapped: false }
let movesOnRecord: number | null = null
let started = false
let liveOpen = false
let phase: Phase = 'loading'
let cached: { stats: Stats; at: number } | null = null
let snapshot: Snapshot = blankSnapshot()
const listeners = new Set<() => void>()

function blankSnapshot(): Snapshot {
  return { phase: 'loading', stats: null, shards: [], names: new Map(), coverage: { ...coverage }, movesOnRecord: null, relays: pool.status(ALL_RELAYS), updatedAt: 0, fromCache: false, live: false }
}

const nowSec = (): number => Math.floor(Date.now() / 1000)

const verify = (ev: NostrEvent): boolean => {
  try { return verifyEvent(ev) } catch { return false }
}

function readCache(): void {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return
    const c = JSON.parse(raw) as { stats: Stats; at: number }
    if (c && c.stats && nowSec() - c.at < CACHE_MAX_AGE) cached = c
  } catch { /* storage blocked or empty */ }
}

function writeCache(stats: Stats): void {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ stats, at: nowSec() })) } catch { /* storage blocked or full */ }
}

/** Recompute and notify, at most every 400 ms while events pour in. */
let pending: ReturnType<typeof setTimeout> | null = null
function changed(): void {
  if (pending) return
  pending = setTimeout(() => { pending = null; publish() }, 400)
}

function publish(): void {
  const usingCache = phase === 'loading' && cached !== null
  const stats = usingCache ? cached!.stats : computeStats(world, nowSec())
  const shards = liveObjects(world).slice(0, SHARDS_SHOWN)
  const names = new Map<string, string>()
  for (const o of shards) { const n = world.profiles.get(o.pubkey)?.name; if (n) names.set(o.pubkey, n) }
  snapshot = {
    phase,
    stats: phase === 'loading' && !usingCache && world.moves.size === 0 && world.objects.size === 0 ? null : stats,
    shards,
    names,
    coverage: { ...coverage },
    // A relay may cap its COUNT (onosendai.feeds.relay.tools answers 500), so
    // never report fewer than the distinct moves this page has itself read.
    movesOnRecord: movesOnRecord === null ? null : Math.max(movesOnRecord, world.moves.size),
    relays: pool.status(ALL_RELAYS),
    updatedAt: nowSec(),
    fromCache: usingCache,
    live: liveOpen,
  }
  if (phase === 'ready') writeCache(stats)
  listeners.forEach((l) => l())
}

function take(events: NostrEvent[]): void {
  let any = false
  for (const ev of events) any = ingest(world, ev, verify) || any
  if (any) changed()
}

/** Profiles for these pubkeys we do not have yet, from every profile relay. */
const askedProfiles = new Set<string>()
async function loadProfiles(pubkeys: string[]): Promise<void> {
  const want = pubkeys.filter((p) => !askedProfiles.has(p)).slice(0, 100)
  if (want.length === 0) return
  want.forEach((p) => askedProfiles.add(p))
  await Promise.all(PROFILE_RELAYS.map(async (url) => {
    const res = await pool.query(url, { kinds: [KIND_PROFILE], authors: want, limit: want.length * 2 })
    take(res.events)
  }))
}

async function loadCyberspaceRelay(url: string, since: number): Promise<void> {
  // Movement in the last 7 days.
  const moves = await pool.queryPaged(url, { kinds: [KIND_MOVE], since, limit: 500 }, 4)
  if (moves.capped) coverage.movesCapped = true
  take(moves.events)
  void loadProfiles([...new Set(moves.events.map((e) => e.pubkey))])
  // A relay that did not finish this read (sign-in, unreachable, hung past
  // the deadline) is not asked anything more on this load: each further read
  // would wait out its own deadline and hold the page in "loading".
  if (moves.end !== 'eose') { changed(); return }
  // Every ride on record: one tag filter, well inside strfry's three.
  const rides = await pool.query(url, { kinds: [KIND_MOVE], '#A': ['hyperjump'], limit: 500 })
  if (rides.events.length >= 500) coverage.ridesCapped = true
  take(rides.events)
  // Bags on record.
  const bags = await pool.queryPaged(url, { kinds: [KIND_BAG], limit: 500 }, 2)
  if (bags.capped) coverage.bagsCapped = true
  take(bags.events)
  // NIP-45, where the relay supports it: every movement event it holds.
  const n = await pool.count(url, { kinds: [KIND_MOVE] })
  if (n !== null && (movesOnRecord === null || n > movesOnRecord)) { movesOnRecord = n; changed() }
}

async function loadShardRelay(url: string): Promise<void> {
  const res = await pool.queryPaged(url, { kinds: [KIND_OBJECT], limit: 200 }, 2)
  if (res.capped) coverage.objectsCapped = true
  take(res.events)
  if (res.end !== 'eose') return
  // The authors' own deletions (NIP-09), so a retracted object is not counted or shown.
  const authors = [...new Set(res.events.map((e) => e.pubkey))]
  for (let i = 0; i < authors.length; i += 100) {
    const del = await pool.query(url, { kinds: [KIND_DELETION], authors: authors.slice(i, i + 100), limit: 500 })
    take(del.events)
  }
  void loadProfiles(liveObjects(world).slice(0, SHARDS_SHOWN).map((o) => o.pubkey))
}

function openLive(): void {
  const since = nowSec()
  const onEvent = (ev: NostrEvent): void => {
    if (ingest(world, ev, verify)) {
      changed()
      if (ev.kind === KIND_MOVE || ev.kind === KIND_OBJECT) void loadProfiles([ev.pubkey])
    }
  }
  for (const url of CYBERSPACE_RELAYS) {
    if (!pool.usable(url)) continue
    pool.live(url, () => ({ kinds: [KIND_MOVE, KIND_BAG, KIND_OBJECT], since }), onEvent)
  }
  for (const url of SHARD_RELAYS) {
    if (CYBERSPACE_RELAYS.includes(url) || !pool.usable(url)) continue
    pool.live(url, () => ({ kinds: [KIND_OBJECT], since }), onEvent)
  }
  liveOpen = true
}

async function start(): Promise<void> {
  readCache()
  publish()
  const since = nowSec() - WEEK
  const general = SHARD_RELAYS.filter((u) => !CYBERSPACE_RELAYS.includes(u))
  await Promise.all([
    ...CYBERSPACE_RELAYS.map((url) => loadCyberspaceRelay(url, since)),
    ...CYBERSPACE_RELAYS.map((url) => loadShardRelay(url)),
    ...general.map((url) => loadShardRelay(url)),
  ])
  const stats = computeStats(world, nowSec())
  const shown = liveObjects(world).slice(0, SHARDS_SHOWN)
  await loadProfiles([...stats.active.slice(0, 40).map((a) => a.pubkey), ...shown.map((o) => o.pubkey)])
  phase = 'ready'
  publish()
  openLive()
  publish()
  // Rolling windows: "last 24 hours" moves on even when nothing arrives.
  setInterval(publish, 30000)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  const offRelays = pool.onStatus(changed)
  return () => { listeners.delete(listener); offRelays() }
}

const getSnapshot = (): Snapshot => snapshot
const serverSnapshot = blankSnapshot()
const getServerSnapshot = (): Snapshot => serverSnapshot

/** The live view of cyberspace. Starts the reads on first use, in the browser only. */
export function useCyberspace(): Snapshot {
  useEffect(() => {
    if (started) return
    started = true
    void start()
  }, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** "3m ago", re-rendered on its own minute clock. */
export function useNow(intervalMs = 30000): number {
  const [now, setNow] = useState(() => nowSec())
  useEffect(() => {
    const t = setInterval(() => setNow(nowSec()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

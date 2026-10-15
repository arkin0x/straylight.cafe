/**
 * world.ts: what the site knows about cyberspace right now, and the stats
 * computed from it. Pure: no networking, no React. The definitions of every
 * stat live here and in the README, and nowhere else.
 *
 * Events are stripped as they arrive to the few tags a stat reads, so a
 * hyperjump's 40 KB proof never sits in memory or in the session cache.
 */

import type { NostrEvent } from './relayClient'
import { objectFromEvent, isDeleted, type FeedObject } from 'sno-core/feed'
import { popularPlaces, type PlaceStat } from './places'

export const KIND_MOVE = 3333
export const KIND_BAG = 33330
export const KIND_OBJECT = 33331
export const KIND_PROFILE = 0
export const KIND_DELETION = 5

export const DAY = 86400
export const WEEK = 7 * DAY

export interface Move {
  id: string
  pubkey: string
  at: number
  /** The `A` tag: spawn, hop, sidestep, enter-hyperspace, hyperjump, ... */
  action: string
  client?: string
  coord?: string
  x?: string
  y?: string
  z?: string
  /** hyperjump: the destination block (`B`) and the station's block (`from_height`). */
  block?: number
  fromBlock?: number
}

export interface Profile {
  name?: string
  picture?: string
  bot: boolean
  at: number
}

export interface World {
  moves: Map<string, Move>
  /** Bags by address (pubkey:d): the newest version of each. */
  bags: Map<string, { pubkey: string; at: number }>
  /** Large shards hidden by reference: encrypted 33331, by address. */
  hiddenObjects: Map<string, { pubkey: string; at: number }>
  /** Public objects by address: the newest version of each. */
  objects: Map<string, FeedObject>
  deletions: Map<string, NostrEvent>
  profiles: Map<string, Profile>
}

export function emptyWorld(): World {
  return { moves: new Map(), bags: new Map(), hiddenObjects: new Map(), objects: new Map(), deletions: new Map(), profiles: new Map() }
}

const tag = (ev: NostrEvent, name: string): string | undefined => ev.tags.find((t) => t[0] === name)?.[1]

function height(v: string | undefined): number | undefined {
  if (v === undefined || !/^\d{1,8}$/.test(v)) return undefined
  return Number(v)
}

/**
 * Fold one event into the world. Returns true when it changed anything.
 * `verify` checks a signature; it is called only for what the page displays
 * (profiles and public objects), and only once an event would change
 * something, so duplicates from several relays cost nothing.
 */
export function ingest(w: World, ev: NostrEvent, verify: (ev: NostrEvent) => boolean = () => true): boolean {
  switch (ev.kind) {
    case KIND_MOVE: {
      if (w.moves.has(ev.id)) return false
      const action = tag(ev, 'A')
      if (!action) return false
      w.moves.set(ev.id, {
        id: ev.id, pubkey: ev.pubkey, at: ev.created_at, action,
        client: tag(ev, 'client'), coord: tag(ev, 'C'),
        x: tag(ev, 'X'), y: tag(ev, 'Y'), z: tag(ev, 'Z'),
        ...(action === 'hyperjump' ? { block: height(tag(ev, 'B')), fromBlock: height(tag(ev, 'from_height')) } : {}),
      })
      return true
    }
    case KIND_BAG: {
      const d = tag(ev, 'd')
      if (!d) return false
      const key = `${ev.pubkey}:${d}`
      const prev = w.bags.get(key)
      if (prev && prev.at >= ev.created_at) return false
      w.bags.set(key, { pubkey: ev.pubkey, at: ev.created_at })
      return true
    }
    case KIND_OBJECT: {
      const d = tag(ev, 'd')
      // d = "avatar" is the retired pre-11333 avatar (kinds.md), not a shard.
      if (!d || d === 'avatar') return false
      const key = `${ev.pubkey}:${d}`
      if (ev.tags.some((t) => t[0] === 'encrypted')) {
        const prev = w.hiddenObjects.get(key)
        if (prev && prev.at >= ev.created_at) return false
        w.hiddenObjects.set(key, { pubkey: ev.pubkey, at: ev.created_at })
        return true
      }
      const prev = w.objects.get(key)
      if (prev && prev.createdAt >= ev.created_at) return false
      const obj = objectFromEvent(ev)
      if (!obj || !verify(ev)) return false
      w.objects.set(key, obj)
      return true
    }
    case KIND_DELETION: {
      if (w.deletions.has(ev.id)) return false
      w.deletions.set(ev.id, ev)
      return true
    }
    case KIND_PROFILE: {
      const prev = w.profiles.get(ev.pubkey)
      if (prev && prev.at >= ev.created_at) return false
      try {
        if (!verify(ev)) return false
        const meta = JSON.parse(ev.content) as Record<string, unknown>
        const name = [meta.display_name, meta.name].find((v): v is string => typeof v === 'string' && v.trim() !== '')
        const picture = typeof meta.picture === 'string' && /^https:\/\//.test(meta.picture) ? meta.picture : undefined
        w.profiles.set(ev.pubkey, { name: name?.trim().slice(0, 48), picture, bot: meta.bot === true, at: ev.created_at })
        return true
      } catch { return false }
    }
    default:
      return false
  }
}

/** Public objects that their own author has not deleted, newest first. */
export function liveObjects(w: World): FeedObject[] {
  const deletions = [...w.deletions.values()]
  return [...w.objects.values()]
    .filter((o) => !isDeleted(o, deletions))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export interface Coverage {
  /** The 7-day movement read hit its page cap on some relay: counts are a floor. */
  movesCapped: boolean
  bagsCapped: boolean
  objectsCapped: boolean
  ridesCapped: boolean
}

export interface ActiveAvatar {
  pubkey: string
  lastAt: number
  lastAction: string
  moves24h: number
  moves7d: number
  bot: boolean
  name?: string
  picture?: string
}

export interface Stop {
  block: number
  riders: number
  rides: number
  /** The stop's coordinate (a ride's `C`): public, the same for everyone who rides there. */
  coord?: string
}

export interface Stats {
  now: number
  avatars24h: number
  avatars7d: number
  moves24h: number
  moves7d: number
  bots7d: number
  bags: number
  bags7d: number
  hiddenObjects: number
  shards: number
  shards7d: number
  blocks: number
  rides: number
  active: ActiveAvatar[]
  stops: Stop[]
  places: PlaceStat[]
}

/** Every number on the page, from the world as it stands. */
export function computeStats(w: World, now: number): Stats {
  const day = now - DAY
  const week = now - WEEK
  const moves = [...w.moves.values()]
  const week7 = moves.filter((m) => m.at >= week)
  const day1 = week7.filter((m) => m.at >= day)

  const byAvatar = new Map<string, ActiveAvatar>()
  for (const m of week7) {
    let a = byAvatar.get(m.pubkey)
    if (!a) {
      const p = w.profiles.get(m.pubkey)
      a = { pubkey: m.pubkey, lastAt: 0, lastAction: m.action, moves24h: 0, moves7d: 0, bot: p?.bot ?? false, name: p?.name, picture: p?.picture }
      byAvatar.set(m.pubkey, a)
    }
    a.moves7d++
    if (m.at >= day) a.moves24h++
    if (m.at > a.lastAt) { a.lastAt = m.at; a.lastAction = m.action }
  }
  const active = [...byAvatar.values()].sort((a, b) => b.lastAt - a.lastAt)

  // Rides: every hyperjump on record (the 7-day read plus the all-time ride read).
  const rides = moves.filter((m) => m.action === 'hyperjump')
  const stopMap = new Map<number, { riders: Set<string>; rides: number; coord?: string }>()
  const touch = (block: number | undefined, pubkey: string, coord?: string): void => {
    if (block === undefined) return
    let s = stopMap.get(block)
    if (!s) { s = { riders: new Set(), rides: 0 }; stopMap.set(block, s) }
    s.riders.add(pubkey)
    if (coord) { s.rides++; s.coord = s.coord ?? coord }
  }
  for (const r of rides) {
    touch(r.block, r.pubkey, r.coord)
    touch(r.fromBlock, r.pubkey)
  }
  const stops = [...stopMap.entries()]
    .map(([block, s]) => ({ block, riders: s.riders.size, rides: s.rides, coord: s.coord }))
    .sort((a, b) => b.riders - a.riders || b.rides - a.rides || a.block - b.block)

  const objects = liveObjects(w)
  const bags = [...w.bags.values()]

  return {
    now,
    avatars24h: new Set(day1.map((m) => m.pubkey)).size,
    avatars7d: byAvatar.size,
    moves24h: day1.length,
    moves7d: week7.length,
    bots7d: active.filter((a) => a.bot).length,
    bags: bags.length,
    bags7d: bags.filter((b) => b.at >= week).length,
    hiddenObjects: w.hiddenObjects.size,
    shards: objects.length,
    shards7d: objects.filter((o) => o.createdAt >= week).length,
    blocks: stopMap.size,
    rides: rides.length,
    active,
    stops,
    places: popularPlaces(week7),
  }
}

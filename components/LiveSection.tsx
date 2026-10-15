'use client'

import { motion } from 'framer-motion'
import { Activity, Bot, Boxes, Footprints, MapPin, Package, Radio, Rocket, Users } from 'lucide-react'
import { naddrEncode, npubEncode } from 'nostr-tools/nip19'
import type { ReactNode } from 'react'
import type { FeedObject } from 'sno-core/feed'
import { useCyberspace, useNow, type Snapshot } from '@/lib/useCyberspace'
import { relayHost, CYBERSPACE_RELAYS } from '@/lib/relays'
import type { RelayStatus } from '@/lib/relayClient'
import type { ActiveAvatar, Stats } from '@/lib/world'
import { MIN_PEOPLE } from '@/lib/places'
import { MIN_STOP_PEOPLE } from '@/lib/world'
import ShardPreview from './ShardPreview'

const fmt = (n: number): string => n.toLocaleString('en-US')

function ago(at: number, now: number): string {
  const s = Math.max(0, now - at)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function shortNpub(pubkey: string): string {
  try { const n = npubEncode(pubkey); return `${n.slice(0, 10)}…${n.slice(-4)}` } catch { return pubkey.slice(0, 8) }
}

function npubLink(pubkey: string): string {
  try { return `https://njump.me/${npubEncode(pubkey)}` } catch { return 'https://njump.me' }
}

/** A stable color per pubkey, for avatars without a picture. */
function hue(pubkey: string): number {
  return parseInt(pubkey.slice(0, 6), 16) % 360
}

const ACTION_LABEL: Record<string, string> = {
  spawn: 'spawned', hop: 'hopped', sidestep: 'sidestepped', 'enter-hyperspace': 'boarded hyperspace',
  hyperjump: 'rode hyperspace', 'enter-virtual': 'entered a game', 'exit-virtual': 'left a game',
}

interface TileProps {
  id: string
  icon: ReactNode
  label: string
  value: number | undefined
  /** Nothing could be read: show "?" rather than a misleading 0. */
  unknown?: boolean
  floor?: boolean
  caption: ReactNode
  color: string
}

function Tile({ id, icon, label, value, unknown, floor, caption, color }: TileProps) {
  return (
    <div
      data-stat={id}
      data-value={unknown ? '?' : value ?? ''}
      className="relative border border-white/10 rounded-lg p-4 bg-black/50 backdrop-blur-sm min-w-0 flex flex-col gap-1"
    >
      <div className={`flex items-start gap-2 text-xs uppercase tracking-wider leading-snug ${color}`}>
        <span className="shrink-0 mt-px">{icon}</span>
        <span className="min-w-0 break-words">{label}</span>
      </div>
      <div className="font-['Orbitron'] text-3xl md:text-4xl font-bold text-white tabular-nums">
        {unknown
          ? <span className="text-gray-500">?</span>
          : value === undefined
          ? <span className="inline-block w-12 h-8 rounded bg-white/10 animate-pulse align-middle" />
          : <>{floor && <span className="text-gray-400 text-2xl md:text-3xl">≥</span>}{fmt(value)}</>}
      </div>
      <div className="text-[11px] md:text-xs text-gray-400 leading-snug">{caption}</div>
    </div>
  )
}

function Tiles({ snap, unknown, unknownShards }: { snap: Snapshot; unknown: boolean; unknownShards: boolean }) {
  const s = snap.stats
  const c = snap.coverage
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      <Tile unknown={unknown} id="avatars24h" icon={<Users className="w-4 h-4" />} label="Avatars active" color="text-cyan-400"
        value={s?.avatars24h} caption={s ? <>last 24 h · {c.movesCapped ? '≥' : ''}{fmt(s.avatars7d)} in 7 d</> : 'last 24 h'} />
      <Tile unknown={unknown} id="moves24h" icon={<Footprints className="w-4 h-4" />} label="Moves" color="text-pink-400"
        value={s?.moves24h} caption={s ? <>last 24 h · {c.movesCapped ? '≥' : ''}{fmt(s.moves7d)} in 7 d</> : 'last 24 h'} />
      <Tile unknown={unknown} id="bots7d" icon={<Bot className="w-4 h-4" />} label="Bots active" color="text-violet-400"
        value={s?.bots7d} caption="last 7 d, profile says bot" />
      <Tile unknown={unknown} id="bags" icon={<Package className="w-4 h-4" />} label="Bags placed" color="text-amber-400"
        value={s?.bags} floor={c.bagsCapped}
        caption={s ? <>on record · +{fmt(s.bags7d)} in 7 d{s.hiddenObjects > 0 && <> · {fmt(s.hiddenObjects)} large shards hidden</>}</> : 'on record'} />
      <Tile unknown={unknownShards} id="shards" icon={<Boxes className="w-4 h-4" />} label="Shards published" color="text-fuchsia-400"
        value={s?.shards} floor={c.objectsCapped} caption={s ? <>public, on record · +{fmt(s.shards7d)} in 7 d</> : 'public, on record'} />
      <Tile unknown={unknown} id="blocks" icon={<Rocket className="w-4 h-4" />} label="Blocks explored" color="text-blue-400"
        value={s?.blocks} floor={c.ridesCapped} caption={s ? <>ridden or boarded · {fmt(s.rides)} rides on record</> : 'ridden or boarded'} />
    </div>
  )
}

function Panel({ title, icon, children, note, className = '' }: { title: string; icon: ReactNode; children: ReactNode; note?: ReactNode; className?: string }) {
  return (
    <div className={`border border-cyan-500/20 rounded-lg p-4 md:p-5 bg-black/50 backdrop-blur-sm min-w-0 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm uppercase tracking-wider text-cyan-300 mb-3">
        {icon}<span>{title}</span>
      </h3>
      {children}
      {note && <p className="text-[11px] text-gray-500 mt-3 leading-snug">{note}</p>}
    </div>
  )
}

function Empty({ loading, children }: { loading: boolean; children: ReactNode }) {
  return <p className={`text-sm text-gray-500 py-4 text-center ${loading ? 'animate-pulse' : ''}`}>{loading ? 'Reading the relays…' : children}</p>
}

function Avatars({ active, now, loading }: { active: ActiveAvatar[]; now: number; loading: boolean }) {
  const shown = active.slice(0, 8)
  return (
    <Panel title="Recently active" icon={<Activity className="w-4 h-4" />} note="Avatars that moved in the last 7 days. Where they are is never shown.">
      {shown.length === 0 ? <Empty loading={loading}>Nobody has moved in the last 7 days on the relays this page can read.</Empty> : (
        <ul className="divide-y divide-white/5">
          {shown.map((a) => (
            <li key={a.pubkey} data-avatar={a.pubkey} className="flex items-center gap-3 py-2 min-w-0">
              <a href={npubLink(a.pubkey)} target="_blank" rel="noopener noreferrer" className="shrink-0">
                {a.picture
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={a.picture} alt="" width={36} height={36} loading="lazy" referrerPolicy="no-referrer" className="w-9 h-9 rounded-md object-cover bg-white/5" />
                  : <span className="block w-9 h-9 rounded-md" style={{ background: `linear-gradient(135deg, hsl(${hue(a.pubkey)} 80% 55%), hsl(${(hue(a.pubkey) + 60) % 360} 80% 35%))` }} />}
              </a>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <a href={npubLink(a.pubkey)} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-gray-100 hover:text-cyan-300">
                    {a.name ?? shortNpub(a.pubkey)}
                  </a>
                  {a.bot && <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded border border-violet-400/50 text-violet-300 uppercase tracking-wider">bot</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">{ACTION_LABEL[a.lastAction] ?? a.lastAction} · {ago(a.lastAt, now)}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm text-cyan-300 tabular-nums">{fmt(a.moves24h)}</div>
                <div className="text-[10px] text-gray-500">moves 24 h</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

function Places({ stats, loading }: { stats: Stats | null; loading: boolean }) {
  const stops = stats?.stops.slice(0, 5) ?? []
  const places = stats?.places.slice(0, 6) ?? []
  return (
    <Panel title="Popular places" icon={<MapPin className="w-4 h-4" />}
      note={<>Named only when enough people were there, bots not counted: {MIN_PEOPLE} for a region (a 30° cell on Earth, or a whole space beyond it, last 7 days), {MIN_STOP_PEOPLE} riders for a stop.</>}>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Hyperspace stops</p>
      {stops.length === 0 ? <Empty loading={loading}>No stop has {MIN_STOP_PEOPLE} non-bot riders yet.</Empty> : (
        <ul className="mb-4">
          {stops.map((s) => (
            <li key={s.block} data-place={`block:${s.block}`} className="flex items-center justify-between gap-3 py-1.5 text-sm min-w-0">
              <span className="truncate text-gray-200">
                Block {fmt(s.block)}{s.block === 0 && <span className="text-gray-500"> (genesis)</span>}
              </span>
              <span className="shrink-0 flex items-center gap-3 text-xs text-gray-400 tabular-nums">
                <span>{fmt(s.riders)} {s.riders === 1 ? 'rider' : 'riders'}</span>
                {s.coord && (
                  <a href={`https://onosendai.tech/C/${s.coord}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 uppercase tracking-wider">visit</a>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Regions, last 7 d</p>
      {places.length === 0 ? <Empty loading={loading}>No region has {MIN_PEOPLE} non-bot avatars yet.</Empty> : (
        <ul>
          {places.map((p) => (
            <li key={p.key} data-place={p.key} className="flex items-center justify-between gap-3 py-1.5 text-sm min-w-0">
              <span className="truncate text-gray-200">{p.label}</span>
              <span className="shrink-0 text-xs text-gray-400 tabular-nums">{fmt(p.visitors)} {p.visitors === 1 ? 'avatar' : 'avatars'}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

function shardLink(o: FeedObject): string {
  try {
    const naddr = naddrEncode({ kind: 33331, pubkey: o.pubkey, identifier: o.d, relays: o.seen?.slice(0, 1) ?? [] })
    return `https://snocrash.art/workshop/${naddr}`
  } catch { return 'https://snocrash.art/feed' }
}

function ShardFeed({ shards, names, now, loading }: { shards: FeedObject[]; names: Map<string, string>; now: number; loading: boolean }) {
  return (
    <Panel title="Shard feed" icon={<Boxes className="w-4 h-4" />} className="lg:col-span-2"
      note="The newest public SNO objects. Hover to turn one; open it to see it whole in snocrash.">
      {shards.length === 0 ? <Empty loading={loading}>No public shards found yet.</Empty> : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {shards.map((o) => (
            <li key={o.address} data-shard={o.address} className="min-w-0">
              <a href={shardLink(o)} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 p-2 rounded-lg border border-white/5 hover:border-fuchsia-400/50 hover:bg-white/5 transition-colors">
                <ShardPreview shard={o.shard} />
                <span className="w-full text-center min-w-0">
                  <span className="block truncate text-xs text-gray-100 group-hover:text-fuchsia-300">{o.shard.name || 'Untitled shard'}</span>
                  <span className="block truncate text-[10px] text-gray-500">{names.get(o.pubkey) ?? shortNpub(o.pubkey)} · {ago(o.createdAt, now)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

const STATE_LABEL: Record<RelayStatus['state'], string> = {
  idle: 'waiting', connecting: 'connecting', open: 'reading', slow: 'not answering', 'auth-required': 'needs sign-in, skipped', unreachable: 'unreachable',
}
const STATE_DOT: Record<RelayStatus['state'], string> = {
  idle: 'bg-gray-500', connecting: 'bg-amber-400 animate-pulse', open: 'bg-emerald-400', slow: 'bg-amber-500', 'auth-required': 'bg-violet-400', unreachable: 'bg-red-500',
}

function RelayStrip({ relays }: { relays: RelayStatus[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {relays.map((r) => (
        <li key={r.url} data-relay={relayHost(r.url)} data-state={r.state}
          className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border border-white/10 bg-black/40 text-gray-400 min-w-0 max-w-full">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATE_DOT[r.state]}`} />
          <span className="truncate">{relayHost(r.url)}</span>
          <span className="text-gray-600 shrink-0">{STATE_LABEL[r.state]}</span>
        </li>
      ))}
    </ul>
  )
}

export default function LiveSection() {
  const snap = useCyberspace()
  const now = useNow()
  const loading = snap.phase === 'loading'
  const stats = snap.stats
  const cyberRelays = snap.relays.filter((r) => CYBERSPACE_RELAYS.includes(r.url))
  const gated = cyberRelays.filter((r) => r.state === 'auth-required')
  const noneOpen = !loading && cyberRelays.every((r) => r.state !== 'open')
  const live = snap.live && cyberRelays.some((r) => r.state === 'open')

  return (
    <section className="py-2 md:py-4" aria-labelledby="live-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
        <motion.h2
          id="live-heading"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-bold font-['Orbitron']"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent">LIVE FROM CYBERSPACE</span>
        </motion.h2>
        <p className="flex items-center gap-2 text-xs text-gray-400" aria-live="polite">
          <Radio className={`w-4 h-4 ${live ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`} />
          {loading
            ? (snap.fromCache ? 'Showing your last visit, refreshing…' : 'Reading the relays…')
            : live ? <>Live · updated {ago(snap.updatedAt, now)}</> : 'Offline, retrying'}
        </p>
      </div>

      {noneOpen && (
        <p className="mb-4 text-sm text-amber-300 border border-amber-500/30 rounded-lg p-3 bg-black/50">
          No cyberspace relay answered without sign-in just now. The numbers below may be empty; the page keeps trying.
        </p>
      )}

      <Tiles snap={snap} unknown={noneOpen && !snap.fromCache} unknownShards={!loading && !snap.fromCache && snap.relays.every((r) => r.state !== 'open')} />

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Avatars active={stats?.active ?? []} now={now} loading={loading} />
        <Places stats={stats} loading={loading} />
        <ShardFeed shards={snap.shards} names={snap.names} now={now} loading={loading} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <RelayStrip relays={snap.relays} />
        <p className="text-[11px] text-gray-500 leading-snug">
          Read straight from public relays in your browser. Nothing is signed or sent.
          {gated.length > 0 && <> {gated.map((r) => relayHost(r.url)).join(', ')} needs sign-in to read, so its events are not counted yet.</>}
          {snap.movesOnRecord !== null && <> At least {fmt(snap.movesOnRecord)} moves on record.</>}
          {' '}A ≥ means a read hit its size limit.
        </p>
      </div>
    </section>
  )
}

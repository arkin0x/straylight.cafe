/**
 * places.ts: where movement happens, coarsely enough to say nothing about
 * any one person.
 *
 * A movement event's sector tags (X, Y, Z) are the axis values shifted right
 * by 30 bits (spec §10), which is about 12 cm: far too precise to show. So a
 * move is reduced to a region, and the regions are deliberately large:
 *
 * - ideaspace (the plane bit is 1): one region, it has no physical meaning;
 * - dataspace on Earth's surface: a 30 by 30 degree cell (thousands of km);
 * - dataspace under the surface, near Earth (out to past geostationary
 *   orbit), or deep dataspace beyond.
 *
 * Any region is only named when at least MIN_PEOPLE different avatars that
 * are not bots moved in it during the window. Bots never count toward that:
 * an operator's own agent standing beside them would otherwise name the
 * operator's region. Earth cells below the threshold are folded into one
 * unnamed "Elsewhere on Earth" row; any other region below it is left out.
 * The math is display-only floating point, not the
 * spec's consensus mapping (§9.7), which only matters for agreeing on exact
 * coordinates.
 */

/** Earth's center on every axis is 2^84 gibsons (§9.7), which is 2^54 in sector units. */
const CENTER_SECTOR = BigInt(2) ** BigInt(54)
/** One sector is 2^30 gibsons; one km is 1000 * 2^33 gibsons; so one km is 8000 sectors. */
const SECTORS_PER_KM = 8000
const EARTH_RADIUS_KM = 6371
/** Surface band: anything within this many km of the mean radius counts as on the surface. */
const SURFACE_BAND_KM = 150
/** Past geostationary orbit (42,164 km from the center). */
const NEAR_EARTH_KM = 50000
/** Degrees per surface cell. */
const CELL_DEG = 30
/** The fewest distinct non-bot avatars before a region is named. */
export const MIN_PEOPLE = 3

export interface PlaceInput {
  pubkey: string
  /** The `C` tag: the 64-hex coordinate where the move landed. */
  coord?: string
  x?: string
  y?: string
  z?: string
}

export interface Region {
  key: string
  label: string
  /** For sorting surface cells after the coarse buckets, and for an icon. */
  kind: 'surface' | 'under' | 'near' | 'deep' | 'ideaspace' | 'elsewhere'
}

function km(sector: string): number | null {
  try { return Number(BigInt(sector) - CENTER_SECTOR) / SECTORS_PER_KM } catch { return null }
}

function band(lo: number, hi: number, pos: string, neg: string): string {
  const fmt = (v: number): string => (v === 0 ? '0°' : `${Math.abs(v)}°${v > 0 ? pos : neg}`)
  // Ordered from the smaller magnitude so a band reads "0° to 30°S", not "-30 to 0".
  return Math.abs(lo) <= Math.abs(hi) ? `${fmt(lo)} to ${fmt(hi)}` : `${fmt(hi)} to ${fmt(lo)}`
}

/** The region a move belongs to, or null when the event does not say where it is. */
export function regionOf(m: PlaceInput): Region | null {
  if (!m.coord || !/^[0-9a-f]{64}$/i.test(m.coord)) return null
  const plane = parseInt(m.coord.slice(-1), 16) & 1
  if (plane === 1) return { key: 'ideaspace', label: 'Ideaspace', kind: 'ideaspace' }
  if (!m.x || !m.y || !m.z) return null
  const x = km(m.x), y = km(m.y), z = km(m.z)
  if (x === null || y === null || z === null) return null
  const r = Math.hypot(x, y, z)
  if (r < EARTH_RADIUS_KM - SURFACE_BAND_KM) return { key: 'under', label: 'Under the surface of Earth', kind: 'under' }
  if (r > NEAR_EARTH_KM) return { key: 'deep', label: 'Deep dataspace', kind: 'deep' }
  if (r > EARTH_RADIUS_KM + SURFACE_BAND_KM) return { key: 'near', label: 'Near Earth, above the surface', kind: 'near' }
  // Cyberspace Y is ECEF Z (north), Cyberspace Z is ECEF Y (§9.4).
  const lat = (Math.asin(Math.max(-1, Math.min(1, y / r))) * 180) / Math.PI
  const lon = (Math.atan2(z, x) * 180) / Math.PI
  const latLo = Math.max(-90, Math.floor(lat / CELL_DEG) * CELL_DEG)
  const lonLo = Math.max(-180, Math.floor(lon / CELL_DEG) * CELL_DEG)
  const latHi = Math.min(90, latLo + CELL_DEG)
  const lonHi = Math.min(180, lonLo + CELL_DEG)
  return {
    key: `earth:${latLo}:${lonLo}`,
    label: `Earth, ${band(latLo, latHi, 'N', 'S')}, ${band(lonLo, lonHi, 'E', 'W')}`,
    kind: 'surface',
  }
}

export interface PlaceStat {
  key: string
  label: string
  kind: Region['kind']
  visitors: number
  moves: number
}

/**
 * Regions ranked by distinct visitors in the window, named only when at
 * least MIN_PEOPLE of those visitors are not bots. Earth cells below that are
 * merged into one unnamed "Elsewhere on Earth" row (its visitor count is
 * distinct across the cells it merges); other regions below it are dropped.
 */
export function popularPlaces(moves: readonly PlaceInput[], isBot: (pubkey: string) => boolean): PlaceStat[] {
  const byKey = new Map<string, { region: Region; visitors: Set<string>; moves: number }>()
  for (const m of moves) {
    const region = regionOf(m)
    if (!region) continue
    let row = byKey.get(region.key)
    if (!row) { row = { region, visitors: new Set(), moves: 0 }; byKey.set(region.key, row) }
    row.visitors.add(m.pubkey)
    row.moves++
  }
  const out: PlaceStat[] = []
  const elsewhere = { visitors: new Set<string>(), moves: 0 }
  for (const row of byKey.values()) {
    const people = [...row.visitors].filter((p) => !isBot(p)).length
    if (people >= MIN_PEOPLE) {
      out.push({ key: row.region.key, label: row.region.label, kind: row.region.kind, visitors: row.visitors.size, moves: row.moves })
    } else if (row.region.kind === 'surface') {
      row.visitors.forEach((p) => elsewhere.visitors.add(p))
      elsewhere.moves += row.moves
    }
  }
  if (elsewhere.moves > 0) {
    out.push({ key: 'elsewhere', label: 'Elsewhere on Earth', kind: 'elsewhere', visitors: elsewhere.visitors.size, moves: elsewhere.moves })
  }
  return out.sort((a, b) => b.visitors - a.visitors || b.moves - a.moves)
}

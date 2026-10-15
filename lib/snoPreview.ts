/**
 * snoPreview.ts: a small, cheap picture of an SNO shard on a 2D canvas.
 *
 * No three.js: sno-core's `flatten` gives positions, per-vertex colors and
 * triangles; this turns them about a vertical axis, sorts the faces back to
 * front, and fills each with its color, lit by one light. Good enough for a
 * 96 px card, and a few hundred faces draw in well under a millisecond.
 */

import { flatten, type ShardModel } from 'sno-core/shards'

interface Prepared {
  pos: Float32Array
  col: Float32Array
  index: number[]
  mode: ShardModel['mode']
  /** The radius that fits the whole shard, about its center. */
  radius: number
  center: [number, number, number]
}

const cache = new WeakMap<ShardModel, Prepared>()

function prepare(shard: ShardModel): Prepared {
  const hit = cache.get(shard)
  if (hit) return hit
  const { positions, colors, index } = flatten(shard)
  const n = positions.length / 3
  const center: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) center[k] += positions[i * 3 + k] / Math.max(1, n)
  let radius = 0
  for (let i = 0; i < n; i++) {
    radius = Math.max(radius, Math.hypot(positions[i * 3] - center[0], positions[i * 3 + 1] - center[1], positions[i * 3 + 2] - center[2]))
  }
  const p: Prepared = { pos: positions, col: colors, index, mode: shard.mode, radius: radius || 1, center }
  cache.set(shard, p)
  return p
}

const rgb = (r: number, g: number, b: number, k = 1): string =>
  `rgb(${Math.round(Math.min(1, r * k) * 255)},${Math.round(Math.min(1, g * k) * 255)},${Math.round(Math.min(1, b * k) * 255)})`

/** Draw a shard turned `yaw` radians about the vertical, seen from a little above. */
export function drawShard(canvas: HTMLCanvasElement, shard: ShardModel, yaw: number): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width, h = canvas.height
  ctx.clearRect(0, 0, w, h)
  const s = prepare(shard)
  const n = s.pos.length / 3
  if (n === 0) return
  const pitch = -0.45
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  const scale = (Math.min(w, h) * 0.42) / s.radius
  const sx = new Float32Array(n), syy = new Float32Array(n), sz = new Float32Array(n)
  const rx = new Float32Array(n), ry = new Float32Array(n), rz = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = s.pos[i * 3] - s.center[0], y = s.pos[i * 3 + 1] - s.center[1], z = s.pos[i * 3 + 2] - s.center[2]
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp
    rx[i] = x1; ry[i] = y2; rz[i] = z2
    sx[i] = w / 2 + x1 * scale
    syy[i] = h / 2 - y2 * scale
    sz[i] = z2
  }
  if (s.mode === 'points' || s.index.length === 0) {
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = rgb(s.col[i * 3], s.col[i * 3 + 1], s.col[i * 3 + 2])
      ctx.beginPath(); ctx.arc(sx[i], syy[i], Math.max(1.5, w / 60), 0, Math.PI * 2); ctx.fill()
    }
    return
  }
  const faces: Array<[number, number, number, number]> = []
  for (let f = 0; f + 2 < s.index.length; f += 3) {
    const a = s.index[f], b = s.index[f + 1], c = s.index[f + 2]
    if (a >= n || b >= n || c >= n) continue
    faces.push([a, b, c, (sz[a] + sz[b] + sz[c]) / 3])
  }
  // Farthest first (the camera looks down -z, so the smallest z is farthest).
  faces.sort((p, q) => p[3] - q[3])
  ctx.lineJoin = 'round'
  for (const [a, b, c] of faces) {
    const r = (s.col[a * 3] + s.col[b * 3] + s.col[c * 3]) / 3
    const g = (s.col[a * 3 + 1] + s.col[b * 3 + 1] + s.col[c * 3 + 1]) / 3
    const bl = (s.col[a * 3 + 2] + s.col[b * 3 + 2] + s.col[c * 3 + 2]) / 3
    ctx.beginPath()
    ctx.moveTo(sx[a], syy[a]); ctx.lineTo(sx[b], syy[b]); ctx.lineTo(sx[c], syy[c]); ctx.closePath()
    if (s.mode === 'lines') {
      ctx.strokeStyle = rgb(r, g, bl)
      ctx.lineWidth = 1.2
      ctx.stroke()
      continue
    }
    // Lambert from a light over the viewer's left shoulder; both sides lit.
    const ux = rx[b] - rx[a], uy = ry[b] - ry[a], uz = rz[b] - rz[a]
    const vx = rx[c] - rx[a], vy = ry[c] - ry[a], vz = rz[c] - rz[a]
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    const len = Math.hypot(nx, ny, nz) || 1
    const lambert = Math.abs((nx * -0.4 + ny * 0.6 + nz * 0.7) / len)
    const k = 0.45 + 0.75 * lambert
    ctx.fillStyle = rgb(r, g, bl, k)
    ctx.strokeStyle = ctx.fillStyle
    ctx.lineWidth = 0.6
    ctx.fill()
    ctx.stroke()
  }
}

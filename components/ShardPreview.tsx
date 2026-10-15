'use client'

import { useEffect, useRef } from 'react'
import type { ShardModel } from 'sno-core/shards'
import { drawShard } from '@/lib/snoPreview'

/**
 * A shard drawn once at rest, turning only while a pointer is over it (and
 * never when the viewer prefers reduced motion), so a page of them costs
 * nothing while you read.
 */
export default function ShardPreview({ shard, size = 112 }: { shard: ShardModel; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const yaw = useRef(0.7)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.round(size * dpr)
    c.height = Math.round(size * dpr)
    try { drawShard(c, shard, yaw.current) } catch { /* a malformed shard draws nothing */ }
    return () => { if (frame.current) cancelAnimationFrame(frame.current) }
  }, [shard, size])

  const spin = (): void => {
    if (frame.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let last = performance.now()
    const step = (t: number): void => {
      yaw.current += ((t - last) / 1000) * 1.2
      last = t
      if (ref.current) { try { drawShard(ref.current, shard, yaw.current) } catch { /* as above */ } }
      frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }
  const stop = (): void => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = null
  }

  const empty = shard.vertices.length === 0
  return (
    <div
      className="relative flex items-center justify-center rounded-md bg-gradient-to-b from-purple-950/40 to-black/60 border border-white/5"
      style={{ width: size, height: size }}
      onPointerEnter={spin}
      onPointerLeave={stop}
    >
      {empty
        ? <span className="text-[10px] uppercase tracking-wider text-gray-500 text-center px-2">made of other objects</span>
        : <canvas ref={ref} style={{ width: size, height: size }} aria-hidden="true" />}
    </div>
  )
}

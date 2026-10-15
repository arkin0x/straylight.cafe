'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface OgCardProps {
  href: string
  /** A copy of the project's own Open Graph image, under public/og. */
  image: string
  alt: string
  title: string
  /** Tailwind classes for the border and glow color family. */
  accent?: 'cyan' | 'pink' | 'purple' | 'blue'
  children?: ReactNode
  delay?: number
}

const ACCENTS = {
  cyan: 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]',
  pink: 'border-pink-500/30 hover:border-pink-400/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
  purple: 'border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  blue: 'border-blue-500/30 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
}

/** A project's link preview card: its real OG image is the link. */
export default function OgCard({ href, image, alt, title, accent = 'cyan', children, delay = 0 }: OgCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`group relative border rounded-lg bg-black/50 backdrop-blur-sm transition-all overflow-hidden flex flex-col min-w-0 ${ACCENTS[accent]}`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="block" aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          width={1200}
          height={630}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto aspect-[1200/630] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </a>
      {children && <div className="p-4 md:p-5 flex flex-col gap-3 flex-grow">{children}</div>}
    </motion.div>
  )
}

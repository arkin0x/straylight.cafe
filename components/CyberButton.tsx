'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CyberButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  external?: boolean
}

export default function CyberButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  external = false
}: CyberButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs sm:px-4 sm:text-sm',
    md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    accent: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
  }

  const className = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    relative inline-flex items-center justify-center font-semibold uppercase tracking-wider
    text-white shadow-lg transition-all duration-300
    hover:shadow-2xl hover:scale-105
    before:absolute before:inset-0 before:border-2 before:border-white/20
    before:transition-all before:duration-300 hover:before:border-white/40
    clip-path-polygon whitespace-nowrap font-['Monaspace_Krypton']
  `

  const content = (
    <motion.span
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 30%, 100% 100%, 10px 100%, 0 70%)',
      }}
    >
      <span className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
        {children}
      </span>
    </motion.span>
  )

  if (href) {
    return (
      <a 
        href={href} 
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick}>
      {content}
    </button>
  )
}
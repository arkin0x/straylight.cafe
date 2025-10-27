'use client'

import { motion } from 'framer-motion'
import { Cpu, BookOpen, Zap, Globe, Radio } from 'lucide-react'
import CyberButton from '@/components/CyberButton'
import ChatMessages from '@/components/ChatMessages'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
      
      {/* Content wrapper for centering */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      
      {/* Header Section */}
      <header className="py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Orbitron'] tracking-wide">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent static-glow">
                STRAYLIGHT
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl mt-1 text-cyan-400 glow-sm">
                CAFÉ
              </span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:text-right"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light mb-4">
              Welcome to the cyberspace community hub
            </p>
            {/* Commented out Launch ONOSENDAI button section
            <div className="flex flex-col sm:flex-row gap-3">
              <CyberButton
                href="https://onosendai.tech"
                variant="primary"
                size="md"
                external
              >
                <span className="flex items-center justify-center gap-2">
                  <Radio className="w-4 h-4" />
                  <span>Launch ONOSENDAI</span>
                </span>
              </CyberButton>
              <p className="text-sm text-gray-400 self-center">
                Enter the one true metaverse
              </p>
            </div>
            */}
          </motion.div>
        </div>
      </header>
      
      {/* Main 2-Column Layout */}
      <section className="py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column - Chat Messages */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <ChatMessages />
            </motion.div>
            
            {/* Join Chat Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center border border-cyan-500/30 rounded-lg p-6 bg-black/50 backdrop-blur-sm"
            >
              <CyberButton
                href="https://app.flotilla.social/join?r=cyberspace.nostr1.com"
                variant="secondary"
                size="md"
                external
              >
                Join Chat
              </CyberButton>
              <p className="text-xs md:text-sm text-gray-400 mt-3">
                Join or sign-in with nostr instantly
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Powered by{' '}
                <a 
                  href="https://flotilla.social" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
                >
                  flotilla.social
                </a>
              </p>
            </motion.div>
          </div>
          
          {/* Right Column - Explore Links */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-6 font-['Orbitron']"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                EXPLORE
              </span>
            </motion.h2>
            
            <div className="flex flex-col gap-6">
              {/* ONOSENDAI Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative border border-cyan-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] flex flex-col"
              >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI</h3>
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                ONOSENDAI is a web-based cyberspace explorer. Dive into nostr-powered virtual reality. Not for the faint of CPU.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <CyberButton
                  href="https://onosendai.tech"
                  variant="secondary"
                  size="sm"
                  external
                >
                  Enter Cyberspace
                </CyberButton>
                <CyberButton
                  href="https://github.com/arkin0x/ONOSENDAI"
                  variant="accent"
                  size="sm"
                  external
                >
                  View on GitHub
                </CyberButton>
              </div>
            </motion.div>

              {/* Cyberspace Protocol Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative border border-purple-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400">Cyberspace Protocol</h3>
                  <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                  A permissionless metaverse powered by bitcoin-like proof-of-work. No blockchains, only nostr. Read the thermodynamic cyberspace protocol specification.
                </p>
                <div>
                  <CyberButton
                    href="https://github.com/arkin0x/cyberspace"
                    variant="accent"
                    size="sm"
                    external
                  >
                    View Specification
                  </CyberButton>
                </div>
              </motion.div>

              {/* Cyberspace International Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group relative border border-pink-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-pink-400/60 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] flex flex-col"
              >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-pink-400">Learn More</h3>
                <Globe className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                Educational resources and documentation for the cyberspace protocol.
              </p>
              <div>
                <CyberButton
                  href="https://cyberspace.international"
                  variant="primary"
                  size="sm"
                  external
                >
                  Documentation
                </CyberButton>
              </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-12 md:py-16 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-yellow-500/30 rounded-lg p-8 md:p-12 bg-black/50 backdrop-blur-sm"
          >
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-['Orbitron']">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Support Development
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-6">
              The only metaverse that matters is the one that nobody can control. Support open protocol and software development and build the future of cyberspace.
            </p>
            <div className="inline-block border border-yellow-500/50 rounded-lg p-3 md:p-4 bg-black/70">
              <p className="text-xs md:text-sm text-gray-400 mb-2">Bitcoin Lightning</p>
              <p className="font-mono text-yellow-400 text-sm md:text-lg break-all">
                arkin0x@strike.me
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-cyan-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Straylight Café
          </p>
        </div>
      </footer>
      </div> {/* End content wrapper */}
    </main>
  )
}
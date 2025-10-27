'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Zap, Globe, Radio } from 'lucide-react'
import CyberButton from '@/components/CyberButton'
import ChatMessages from '@/components/ChatMessages'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
      
      {/* Content wrapper for centering */}
      <div className="relative z-10 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 font-['Orbitron'] tracking-wide md:tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent static-glow">
              STRAYLIGHT
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 text-cyan-400 glow-sm">
              CAFÉ
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-16 text-gray-300 font-light px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Welcome to the cyberspace community hub
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 px-4 sm:px-0"
          >
            <CyberButton
              href="https://onosendai.tech"
              variant="primary"
              size="lg"
              external
            >
              <span className="flex items-center justify-center gap-2">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Launch ONOSENDAI</span>
              </span>
            </CyberButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xs sm:text-sm text-gray-400"
          >
            Enter the one true metaverse
          </motion.p>
        </motion.div>

      </section>
      
      {/* Scroll indicator - moved outside hero section */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full p-1">
          <motion.div
            className="w-1 h-2 bg-cyan-400 rounded-full mx-auto"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        </motion.div>
      )}

      {/* Links Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center font-['Orbitron']"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              EXPLORE THE NETWORK
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* ONOSENDAI Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative border border-cyan-500/30 rounded-lg p-8 md:p-10 bg-black/50 backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI</h3>
                <ExternalLink className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                The cyberspace client for the one true metaverse. Dive into nostr-powered virtual reality.
              </p>
              <div>
                <CyberButton
                  href="https://onosendai.tech"
                  variant="secondary"
                  size="sm"
                  external
                >
                  Enter Cyberspace
                </CyberButton>
              </div>
            </motion.div>

            {/* GitHub Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative border border-purple-500/30 rounded-lg p-8 md:p-10 bg-black/50 backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-purple-400">Source Code</h3>
                <Github className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              </div>
              <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                Contribute to ONOSENDAI development. Open source and community driven.
              </p>
              <div>
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

            {/* Cyberspace International Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative border border-pink-500/30 rounded-lg p-8 md:p-10 bg-black/50 backdrop-blur-sm hover:border-pink-400/60 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] flex flex-col"
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
      </section>

      {/* Chat Messages Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ChatMessages />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <CyberButton
              href="https://app.flotilla.social/join?r=cyberspace.nostr1.com"
              variant="secondary"
              size="md"
              external
            >
              Join the Conversation
            </CyberButton>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 lg:px-8 pb-24">
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
              Help us build the future of cyberspace
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
      <footer className="py-8 px-4 md:px-6 lg:px-8 border-t border-cyan-500/20">
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
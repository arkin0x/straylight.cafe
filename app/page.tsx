'use client'

import { motion } from 'framer-motion'
import { Cpu, BookOpen, Zap, Globe, Terminal, Rocket, Bot, Lock, Compass, Sparkles, Satellite, Radio } from 'lucide-react'
import CyberButton from '@/components/CyberButton'
import ChatMessages from '@/components/ChatMessages'
import { useState } from 'react'

export default function Home() {

  const [copiedCliInstall, setCopiedCliInstall] = useState(false)
  const cliCloneCommand = 'git clone https://github.com/arkin0x/cyberspace-cli.git && cd cyberspace-cli'
  const cliInstallCommands = `${cliCloneCommand}
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e .`

  const handleCopyCliInstall = async () => {
    try {
      await navigator.clipboard.writeText(cliInstallCommands)
      setCopiedCliInstall(true)
      window.setTimeout(() => setCopiedCliInstall(false), 1600)
    } catch {
      setCopiedCliInstall(false)
    }
  }
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />

      {/* Content wrapper for centering */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        {/* Header Section */}
        <header className="py-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:text-right"
            >
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-light mb-4">
                The cyberspace community hub <Satellite className="w-10 h-10 text-gray-400 inline-block ml-2 animate-pulse" />
              </p>
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
                  Enter cyberspace v2
                </p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Layout */}
        <section className="py-4 md:py-4 pt-2">
          {/* Intro/Chat + Explore row */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Intro + Chat */}
            <div className="min-w-0 order-1">
              {/* Cyberspace Intro */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="relative border border-purple-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-3 font-['Orbitron']">
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    WELCOME TO CYBERSPACE
                  </span>
                </h2>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  Cyberspace is a permissionless, thermodynamic spatial protocol that uses math to impose locality on a spaceless digital system. It can be used for:
                </p>
                <ul className="text-sm md:text-base text-gray-200 my-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                    <span>AI embodiment and single-presence restriction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                    <span>trustlessly restricting data access by location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Compass className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                    <span>open and interoperable augmented reality layers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                    <span>and whatever else you imagine!</span>
                  </li>
                </ul>
                <div className="my-6">
                  <CyberButton
                    href="https://github.com/arkin0x/cyberspace"
                    variant="accent"
                    size="sm"
                    external
                  >
                    View Specification
                  </CyberButton>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed gap-2 my-3">
                  Identity is anchored to location, movement requires verifiable work via Cantor pairing trees, and content is locked to regions discoverable only through computational presence, all encoded as Nostr events.
                </p>
                <div className="border border-purple-500/25 rounded-lg p-4 mt-8 bg-black/40">
                  <p className="text-xs text-gray-300 leading-relaxed gap-2">
                    <BookOpen className="w-10 h-10 inline align-bottom" /> The cyberspace protocol is the realization of the original vision of a metaverse as a single, shared, persistent, and interoperable virtual space that is not owned or controlled by any entity. Heavily inspired by Neuromancer, Snow Crash, and other cyberpunk classics, as well as the vibrant history of open metaverse projects and communities that have come before, cyberspace is a new kind of digital commons built on first principles of thermodynamics, decentralization, open standards, and user sovereignty.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-6"
              >
                <ChatMessages />
              </motion.div>
            </div>

            {/* Right Column - Explore (shows before Archive on mobile) */}
            <div className="min-w-0 order-2">
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
                {/* ONOSENDAI v2 Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="group relative border border-cyan-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI v2</h3>
                    <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-4 leading-relaxed">
                    The cyberspace explorer, rebuilt to protocol v2 in two days. Point-to-point traversal, location-encrypted secrets and shards, real-time spectating, consensual hallucinations across 85 orders of magnitude of scale.
                  </p>
                  <ul className="text-sm text-gray-200 mb-6 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      <span>Hide messages and 3D shards encrypted by location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      <span>Spectate any pubkey or target them in your HUD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      <span>Scrub through any movement chain, yours or theirs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      <span>Full 3D shard editor, mobile optimized, login with nsec or bunker</span>
                    </li>
                  </ul>
                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <CyberButton
                      href="https://onosendai.tech"
                      variant="secondary"
                      size="sm"
                      external
                    >
                      Launch ONOSENDAI
                    </CyberButton>
                    <CyberButton
                      href="https://github.com/arkin0x/cyberspace"
                      variant="accent"
                      size="sm"
                      external
                    >
                      Read the Spec
                    </CyberButton>
                  </div>
                </motion.div>

                {/* Cyberspace Protocol Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="group relative border border-purple-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-purple-400/60 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-purple-400">Cyberspace Protocol</h3>
                    <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-4 leading-relaxed">
                    Cyberspace Protocol v2 is a major overhaul introducing new native capabilities like location-based encryption and discrete movement mechanics.
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
                  <div className="border border-purple-500/25 rounded-lg p-4 mt-8 bg-black/40">
                    <p className="text-xs uppercase tracking-wider text-purple-300 mb-2">DECKs</p>
                    <p className="text-xs md:text-sm text-gray-300 mb-4 leading-relaxed">
                      Explore extension documents for the protocol, including hyperjumps and other capability proposals.
                    </p>
                    <CyberButton
                      href="https://github.com/arkin0x/cyberspace/tree/master/decks"
                      variant="accent"
                      size="sm"
                      external
                    >
                      Browse DECKs
                    </CyberButton>
                  </div>
                </motion.div>

                {/* cyberspace-cli Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="group relative border border-cyan-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-cyan-400">cyberspace-cli</h3>
                    <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
                    The Python cyberspace-cli is the new reference implementation for Cyberspace Protocol v2.
                  </p>
                  <div className="mb-6">
                    <CyberButton
                      href="https://github.com/arkin0x/cyberspace-cli"
                      variant="secondary"
                      size="sm"
                      external
                    >
                      View on GitHub
                    </CyberButton>
                  </div>
                  <div className="border border-cyan-500/25 rounded-lg p-4 bg-black/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                      <p className="w-full min-w-0 sm:flex-1 text-xs md:text-sm font-mono text-cyan-300 break-all">{cliCloneCommand}</p>
                      <button
                        type="button"
                        onClick={handleCopyCliInstall}
                        className="self-start sm:self-auto shrink-0 px-3 py-1.5 text-xs uppercase tracking-wider text-cyan-200 border border-cyan-500/40 rounded hover:border-cyan-300 hover:text-cyan-100 transition-colors"
                      >
                        {copiedCliInstall ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="max-w-full overflow-x-auto">
                      <code className="text-xs md:text-sm font-mono text-cyan-200 leading-relaxed break-all">
                        {`python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e .`}
                      </code>
                    </pre>
                  </div>
                </motion.div>

                {/* Hyperjump Explorer Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="group relative border border-blue-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-blue-400/60 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-400">Hyperjump Explorer</h3>
                    <Rocket className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                    Explore bitcoin blocks projected into thermodynamic cyberspace by merkle root in an interactive 3D explorer. Hyperjumps are DECK-1 events that enable fast travel between anchored blocks.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <CyberButton
                      href="https://hyperjump.onosendai.tech"
                      variant="secondary"
                      size="sm"
                      external
                    >
                      Open Explorer
                    </CyberButton>
                    <CyberButton
                      href="https://github.com/arkin0x/cyberspace/blob/master/decks/DECK-0001-hyperjumps.md"
                      variant="accent"
                      size="sm"
                      external
                    >
                      Read DECK-1
                    </CyberButton>
                  </div>
                </motion.div>

                {/* Learn More Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="group relative border border-pink-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-pink-400/60 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-pink-400">Learn More</h3>
                    <Globe className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-3 leading-relaxed">
                    cyberspace.international is under construction and coming soon. The site is not live yet.
                  </p>
                  <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                    Read the foundational essay: Nostr: The Dawn of Cyberspace.
                  </p>
                  <div>
                    <CyberButton
                      href="https://habla.news/a/naddr1qvzqqqr4gupzp68dx7vvdlltl7sg2qdv8838ze3tl5tq76y0jnz966fdsana6dz6qq25ce6ff3ny7mm40ff42hmgfue52mn4244ngch7r2a"
                      variant="primary"
                      size="sm"
                      external
                    >
                      Read the Article
                    </CyberButton>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Archive (full width below intro/chat + explore) */}
          <div className="mt-10">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-6 font-['Orbitron']"
            >
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                ARCHIVE
              </span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* ONOSENDAI v1 Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="group relative border border-cyan-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-cyan-400/60 transition-all hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI v1 (Retired)</h3>
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                  The original ONOSENDAI, retired after 58 days of work when cyberspace v2 landed. Its successor, ONOSENDAI v2, was rebuilt to the new spec and now exceeds everything v1 ever did.
                </p>
                <div>
                  <CyberButton
                    href="https://github.com/arkin0x/ONOSENDAI"
                    variant="accent"
                    size="sm"
                    external
                  >
                    View Repo
                  </CyberButton>
                </div>
              </motion.div>

              {/* Construct Miner Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group relative border border-amber-500/30 rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm hover:border-amber-400/60 transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-400">Construct Miner (Deprecated)</h3>
                  <Cpu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                  Construct Miner is deprecated due to the protocol upgrade to v2, but it remains available for historical reference.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <CyberButton
                    href="https://construct.onosendai.tech"
                    variant="secondary"
                    size="sm"
                    external
                  >
                    Open Construct
                  </CyberButton>
                  <CyberButton
                    href="https://github.com/arkin0x/construct-miner"
                    variant="accent"
                    size="sm"
                    external
                  >
                    View on GitHub
                  </CyberButton>
                </div>
              </motion.div>
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
              © 2026 Straylight Café
            </p>
          </div>
        </footer>
      </div > {/* End content wrapper */}
    </main >
  )
}

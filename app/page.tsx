'use client'

import { motion } from 'framer-motion'
import { Cpu, BookOpen, Zap, Globe, Terminal, Bot, Lock, Compass, Sparkles, Satellite, Radio, Map as MapIcon } from 'lucide-react'
import CyberButton from '@/components/CyberButton'
import CopyBox from '@/components/CopyBox'
import LiveSection from '@/components/LiveSection'
import OgCard from '@/components/OgCard'

const LINKS = {
  onosendai: 'https://onosendai.tech/',
  tour: 'https://onosendai.tech/demo',
  youtube: 'https://www.youtube.com/watch?v=e7uVFkwxKh8',
  snocrash: 'https://snocrash.art/',
  snoSpec: 'https://github.com/arkin0x/cyberspace/blob/master/decks/DECK-0003-sno.md',
  snoSpecRendered: 'https://www.cyberspace.international/spec/sno',
  ditto: 'https://ditto.pub/',
  grimoire: 'https://grimoire.rocks/',
  spec: 'https://github.com/arkin0x/cyberspace',
  decks: 'https://github.com/arkin0x/cyberspace/tree/master/decks',
  hyperspace: 'https://github.com/arkin0x/cyberspace/blob/master/decks/DECK-0001-hyperspace.md',
  site: 'https://www.cyberspace.international/',
  learn: 'https://www.cyberspace.international/learn',
  mcp: 'https://github.com/arkin0x/cyberspace-mcp',
  agents: 'https://github.com/arkin0x/cyberspace/blob/master/docs/agents.md',
  cli: 'https://github.com/arkin0x/cyberspace-cli',
  essay: 'https://yakihonne.com/article/naddr1qq25ce6ff3ny7mm40ff42hmgfue52mn4244ngq3qarkn0xxxll4llgy9qxkrncn3vc4l69s0dz8ef3zadykcwe7ax3dqxpqqqp65wackq8r',
  onosendaiV1: 'https://github.com/arkin0x/ONOSENDAI/tree/v1-final',
  construct: 'https://construct.onosendai.tech',
  constructRepo: 'https://github.com/arkin0x/construct-miner',
}

const CARD = 'group relative border rounded-lg p-6 md:p-8 bg-black/50 backdrop-blur-sm transition-all flex flex-col min-w-0'

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

function SectionTitle({ children, gradient }: { children: React.ReactNode; gradient: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-2xl md:text-3xl font-bold mb-6 font-['Orbitron']"
    >
      <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{children}</span>
    </motion.h2>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <header className="py-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
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
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <CyberButton href={LINKS.onosendai} variant="primary" size="md" external>
                  <span className="flex items-center justify-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>Launch ONOSENDAI</span>
                  </span>
                </CyberButton>
                <CyberButton href={LINKS.tour} variant="secondary" size="md" external>
                  <span className="flex items-center justify-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    <span>Take the tour</span>
                  </span>
                </CyberButton>
              </div>
            </motion.div>
          </div>
        </header>

        {/* The main draw: what is happening in cyberspace right now */}
        <LiveSection />

        <section className="py-10 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left: the idea, the protocol, and where to learn it */}
            <div className="min-w-0 flex flex-col gap-6">
              <Reveal delay={0.05} className={`${CARD} border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]`}>
                <h2 className="text-xl md:text-2xl font-bold mb-3 font-['Orbitron']">
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    WELCOME TO CYBERSPACE
                  </span>
                </h2>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  Cyberspace is a permissionless, thermodynamic spatial protocol that uses math to impose locality on a spaceless digital system. It can be used for:
                </p>
                <ul className="text-sm md:text-base text-gray-200 my-3 space-y-2">
                  <li className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" /><span>AI embodiment and single-presence restriction</span></li>
                  <li className="flex items-start gap-2"><Lock className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" /><span>trustlessly restricting data access by location</span></li>
                  <li className="flex items-start gap-2"><Compass className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" /><span>open and interoperable augmented reality layers</span></li>
                  <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" /><span>and whatever else you imagine!</span></li>
                </ul>
                <p className="text-sm text-gray-300 leading-relaxed my-3">
                  Identity is anchored to location, movement requires verifiable work via Cantor pairing trees, and content is locked to regions discoverable only through computational presence, all encoded as Nostr events.
                </p>
                <div className="border border-purple-500/25 rounded-lg p-4 mt-4 bg-black/40">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <BookOpen className="w-10 h-10 inline align-bottom mr-1" /> The cyberspace protocol is the realization of the original vision of a metaverse as a single, shared, persistent, and interoperable virtual space that is not owned or controlled by any entity. Heavily inspired by Neuromancer, Snow Crash, and other cyberpunk classics, as well as the vibrant history of open metaverse projects and communities that have come before, cyberspace is a new kind of digital commons built on first principles of thermodynamics, decentralization, open standards, and user sovereignty.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1} className={`${CARD} border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-purple-400">Cyberspace Protocol</h3>
                  <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
                  Version 2: discrete movement by proof of work, location-based encryption, and hyperspace transit along the Bitcoin blockchain.
                </p>
                <div className="flex flex-wrap gap-3">
                  <CyberButton href={LINKS.spec} variant="accent" size="sm" external>View Specification</CyberButton>
                  <CyberButton href={LINKS.decks} variant="accent" size="sm" external>Browse DECKs</CyberButton>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-4 leading-relaxed">
                  DECKs extend the protocol: <a className="text-purple-300 hover:text-purple-200 underline" href={LINKS.hyperspace} target="_blank" rel="noopener noreferrer">DECK-0001 Hyperspace</a> and <a className="text-purple-300 hover:text-purple-200 underline" href={LINKS.snoSpec} target="_blank" rel="noopener noreferrer">DECK-0003 SNO</a>.
                </p>
              </Reveal>

              <OgCard href={LINKS.site} image="/og/cyberspace-international.webp" accent="pink" delay={0.15}
                title="cyberspace.international"
                alt="cyberspace.international: A digital space where distance is real. Try. Learn. Build.">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-bold text-pink-400">Learn</h3>
                  <Globe className="w-5 h-5 text-pink-400 flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  The spec, rendered, with interactive 3D scenes of how it works.
                </p>
                <div className="flex flex-wrap gap-3">
                  <CyberButton href={LINKS.learn} variant="primary" size="sm" external>Interactive scenes</CyberButton>
                  <CyberButton href={LINKS.essay} variant="accent" size="sm" external>The 2023 essay</CyberButton>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Nostr: The Dawn of Cyberspace. Its thesis holds; its mechanics predate v2.
                </p>
              </OgCard>
            </div>

            {/* Right: the software */}
            <div className="min-w-0">
              <SectionTitle gradient="from-cyan-400 to-blue-500">EXPLORE</SectionTitle>
              <div className="flex flex-col gap-6">
                <OgCard href={LINKS.onosendai} image="/og/onosendai.webp" accent="cyan" delay={0.1}
                  title="ONOSENDAI"
                  alt="The ONOSENDAI wordmark and its yellow mark beside a scene from the app: the violet ring of the Black Sun, a cyan hyperjump beam with an avatar inside it, and a neon structure beyond.">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI</h3>
                    <Cpu className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  </div>
                  <ul className="text-sm text-gray-200 space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">▸</span><span>Hide messages, shards, keys and chests, encrypted by location</span></li>
                    <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">▸</span><span>Ride hyperspace between Bitcoin blocks</span></li>
                    <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">▸</span><span>Chat with whoever is near, and bring your own AI agent</span></li>
                    <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">▸</span><span>Build in the 3D workshop, on desktop or phone</span></li>
                  </ul>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <CyberButton href={LINKS.onosendai} variant="secondary" size="sm" external>Launch ONOSENDAI</CyberButton>
                    <CyberButton href={LINKS.tour} variant="accent" size="sm" external>Guided tour</CyberButton>
                    <CyberButton href={LINKS.youtube} variant="primary" size="sm" external>
                      <span className="flex items-center justify-center gap-2">
                        <Radio className="w-4 h-4" />
                        <span>Watch Cyberspace TV live</span>
                      </span>
                    </CyberButton>
                  </div>
                </OgCard>

                <div className="grid sm:grid-cols-2 gap-6">
                  <OgCard href={LINKS.snocrash} image="/og/snocrash.webp" accent="purple" delay={0.15}
                    title="SNOCRASH"
                    alt="A glowing neon wireframe polyhedron in dark smoke, beside the word SNOCRASH.">
                    <h3 className="text-lg font-bold text-fuchsia-400">snocrash</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">Make, publish, browse and remix small 3D objects on nostr.</p>
                  </OgCard>
                  <OgCard href={LINKS.snoSpec} image="/og/sno-spec.webp" accent="purple" delay={0.2}
                    title="DECK-0003: SNO"
                    alt="The GitHub card for arkin0x/cyberspace, the repository that holds the SNO spec.">
                    <h3 className="text-lg font-bold text-fuchsia-400">SNO spec</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      DECK-0003, the Simple Nostr Object format. Also <a className="text-fuchsia-300 hover:text-fuchsia-200 underline" href={LINKS.snoSpecRendered} target="_blank" rel="noopener noreferrer">rendered here</a>.
                    </p>
                  </OgCard>
                </div>

                <Reveal delay={0.2} className="-mt-2 border border-purple-500/30 rounded-lg bg-black/50 backdrop-blur-sm px-4 py-3 md:px-5">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-bold text-fuchsia-400">Clients that render SNO:</span>{' '}
                    <a className="text-fuchsia-300 hover:text-fuchsia-200 underline" href={LINKS.ditto} target="_blank" rel="noopener noreferrer">Ditto</a>, whose Blobbi pets keep objects as furniture, and{' '}
                    <a className="text-fuchsia-300 hover:text-fuchsia-200 underline" href={LINKS.grimoire} target="_blank" rel="noopener noreferrer">Grimoire</a>.
                  </p>
                </Reveal>

                <Reveal delay={0.2} className={`${CARD} border-violet-500/30 hover:border-violet-400/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-violet-400">cyberspace-mcp</h3>
                    <Bot className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
                    Give an AI agent a body in cyberspace: its own key, movement by proof of work, chat, bags and objects. A local MCP server for any MCP client.
                  </p>
                  <div className="mb-6">
                    <CopyBox tone="violet" lines={['npx github:arkin0x/cyberspace-mcp init']} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <CyberButton href={LINKS.mcp} variant="accent" size="sm" external>View on GitHub</CyberButton>
                    <CyberButton href={LINKS.agents} variant="accent" size="sm" external>Read agents.md</CyberButton>
                  </div>
                </Reveal>

                <Reveal delay={0.25} className={`${CARD} border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-cyan-400">cyberspace-cli</h3>
                    <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                  <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
                    The Python cyberspace-cli is the reference implementation for Cyberspace Protocol v2.
                  </p>
                  <div className="mb-6">
                    <CyberButton href={LINKS.cli} variant="secondary" size="sm" external>View on GitHub</CyberButton>
                  </div>
                  <CopyBox lines={[
                    'git clone https://github.com/arkin0x/cyberspace-cli.git && cd cyberspace-cli',
                    'python3 -m venv .venv',
                    'source .venv/bin/activate',
                    'pip install -U pip',
                    'pip install -e .',
                  ]} />
                </Reveal>
              </div>
            </div>
          </div>

          {/* Archive */}
          <div className="mt-10">
            <SectionTitle gradient="from-orange-400 to-pink-500">ARCHIVE</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">
              <Reveal delay={0.1} className={`${CARD} border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-400">ONOSENDAI v1 (Retired)</h3>
                  <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                  The original ONOSENDAI, retired after 58 days of work when cyberspace v2 landed. Its successor, ONOSENDAI v2, was rebuilt to the new spec and now exceeds everything v1 ever did.
                </p>
                <div>
                  <CyberButton href={LINKS.onosendaiV1} variant="accent" size="sm" external>View v1 code</CyberButton>
                </div>
              </Reveal>

              <Reveal delay={0.2} className={`${CARD} border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-amber-400">Construct Miner (Deprecated)</h3>
                  <Cpu className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-8 flex-grow leading-relaxed">
                  Construct Miner is deprecated due to the protocol upgrade to v2, but it remains available for historical reference.
                </p>
                <div className="flex flex-wrap gap-3">
                  <CyberButton href={LINKS.construct} variant="secondary" size="sm" external>Open Construct</CyberButton>
                  <CyberButton href={LINKS.constructRepo} variant="accent" size="sm" external>View on GitHub</CyberButton>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Donation */}
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
              <div className="inline-block border border-yellow-500/50 rounded-lg p-3 md:p-4 bg-black/70 max-w-full">
                <p className="text-xs md:text-sm text-gray-400 mb-2">Bitcoin Lightning</p>
                <p className="font-mono text-yellow-400 text-sm md:text-lg break-all">
                  arkin0x@strike.me
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 border-t border-cyan-500/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 text-sm">© 2026 Straylight Café</p>
          </div>
        </footer>
      </div>
    </main>
  )
}

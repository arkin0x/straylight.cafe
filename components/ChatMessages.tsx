'use client'

import { useEffect, useState } from 'react'
import { SimplePool, Event } from 'nostr-tools'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, RefreshCw } from 'lucide-react'
import CyberButton from './CyberButton'

const ARKINOX = 'e8ed3798c6ffebffa08501ac39e271662bfd160f688f94c45d692d8767dd345a'

export default function ChatMessages() {
  const [messages, setMessages] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const pool = new SimplePool()
      const relay = 'wss://cyberspace.nostr1.com'

      const chatevents = await pool.querySync(
        [relay],
        {
          kinds: [9],
          limit: 10,
        }
      )

      const arkinoxevents = await pool.querySync(
        [relay],
        {
          authors: [ARKINOX],
          kinds: [1],
          "#t": ['cyberspace', 'straylight'],
          limit: 10,
        }
      )

      const events = [...chatevents, ...arkinoxevents]

      // Sort by created_at timestamp (oldest first, so newest appears at bottom)
      const sortedEvents = events.sort((a, b) => a.created_at - b.created_at)
      setMessages(sortedEvents.slice(-5)) // Show only 5 most recent
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Unable to connect to cyberspace relay')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  const truncateNpub = (npub: string) => {
    if (npub.length <= 16) return npub
    return `${npub.slice(0, 8)}...${npub.slice(-4)}`
  }

  const truncateMessage = (message: string, maxLength: number = 200) => {
    if (message.length <= maxLength) return message
    return `${message.slice(0, maxLength).trim()}...`
  }

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3 min-w-0">
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          <div className="flex flex-col min-w-0">
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cyberspace Chatter
            </span>
            <span className="block text-xs text-gray-500 break-all">
              from official relay wss://cyberspace.nostr1.com
            </span>
          </div>
        </h2>
        <button
          onClick={fetchMessages}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="border border-cyan-500/30 rounded-lg bg-black/50 backdrop-blur-sm overflow-hidden p-2 md:p-4">
        {loading && messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-pulse">Connecting to cyberspace...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No messages found
          </div>
        ) : (
          <AnimatePresence>
            <div className="divide-y divide-cyan-500/20">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 md:p-6 hover:bg-white/5 transition-colors rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <span className="text-cyan-400 font-['Monaspace_Krypton'] text-xs md:text-sm font-medium">
                      {msg.pubkey === ARKINOX ? "arkinox" : truncateNpub(msg.pubkey)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-200 break-words leading-relaxed">
                    {truncateMessage(msg.content)}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
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

    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { SimplePool, Event } from 'nostr-tools'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, RefreshCw } from 'lucide-react'

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
      
      const events = await pool.querySync(
        [relay],
        {
          kinds: [9],
          limit: 10,
        }
      )
      
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Cyberspace Chatter
          </span>
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
                      {truncateNpub(msg.pubkey)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-200 break-words leading-relaxed">
                    {msg.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
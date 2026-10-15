'use client'

import { useState } from 'react'

/** A command to run, with a button that copies all of it. */
export default function CopyBox({ lines, tone = 'cyan' }: { lines: string[]; tone?: 'cyan' | 'violet' }) {
  const [copied, setCopied] = useState(false)
  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  const [first, ...rest] = lines
  const c = tone === 'cyan'
    ? { box: 'border-cyan-500/25', text: 'text-cyan-300', rest: 'text-cyan-200', btn: 'text-cyan-200 border-cyan-500/40 hover:border-cyan-300 hover:text-cyan-100' }
    : { box: 'border-violet-500/25', text: 'text-violet-300', rest: 'text-violet-200', btn: 'text-violet-200 border-violet-500/40 hover:border-violet-300 hover:text-violet-100' }
  return (
    <div className={`border rounded-lg p-4 bg-black/60 ${c.box}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${rest.length ? 'mb-2' : ''}`}>
        <p className={`w-full min-w-0 sm:flex-1 text-xs md:text-sm font-mono break-all ${c.text}`}>{first}</p>
        <button
          type="button"
          onClick={copy}
          className={`self-start sm:self-auto shrink-0 px-3 py-1.5 text-xs uppercase tracking-wider border rounded transition-colors ${c.btn}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {rest.length > 0 && (
        <pre className="max-w-full overflow-x-auto">
          <code className={`text-xs md:text-sm font-mono leading-relaxed break-all ${c.rest}`}>{rest.join('\n')}</code>
        </pre>
      )}
    </div>
  )
}

'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bot, Send, Mic, Globe2, Zap } from 'lucide-react'
import Link from 'next/link'

const DEMO_PROMPTS = [
  'Where is the nearest food stall with shortest queue?',
  'Show me crowd density near Gate C right now',
  'Translate this announcement to Spanish and Arabic',
  'Generate post-match incident summary for Sector 14',
  'Route wheelchair user from parking P3 to seat 42B',
]

const DEMO_RESPONSES: Record<string, { text: string; tags: string[] }> = {
  'Where is the nearest food stall with shortest queue?': {
    text: "Based on real-time crowd flow data, **Food Zone F3** on Level 2 near Section 104 has the shortest wait time — estimated **3 minutes**. It offers hot dogs, nachos, and beverages. I can show you turn-by-turn navigation on the stadium map. Zone F8 is also nearby with a 5-minute wait if you prefer more options.",
    tags: ['Maps API', 'Real-time', 'Navigation'],
  },
  'Show me crowd density near Gate C right now': {
    text: "**Gate C** is currently at **78% capacity** — moderate density. Crowd AI predicts a surge in 12 minutes as Match 3 ends. I recommend diverting 40% of traffic to Gate D (currently at 42%). Security Team Alpha has been notified. Live heatmap is now updating on your dashboard.",
    tags: ['Crowd AI', 'Predictive', 'Alert Sent'],
  },
  'Translate this announcement to Spanish and Arabic': {
    text: "Ready to translate. **Spanish:** 'Atención fans, el partido comenzará en 15 minutos. Por favor diríganse a sus asientos.' **Arabic:** 'انتباه المشجعين، ستبدأ المباراة خلال 15 دقيقة. يرجى التوجه إلى مقاعدكم.' Broadcast via PA system?",
    tags: ['Translation API', '120+ Languages', 'Broadcast'],
  },
  'Generate post-match incident summary for Sector 14': {
    text: "**Sector 14 Post-Match Summary — Match 22:** 2 minor medical incidents (treated on-site), 1 lost child resolved in 4 min, crowd density peaked at 94% at 76th minute. 0 security escalations. Volunteer team performance: 97/100. AI recommendation: Add 1 medical responder for next high-density match.",
    tags: ['Generative AI', 'Gemini Pro', 'Report'],
  },
  'Route wheelchair user from parking P3 to seat 42B': {
    text: "**Accessible Route P3 → Seat 42B:** Elevator E2 (currently operational) → Level 1 corridor → Accessible ramp R4 → Section 42. Total distance: 380m, estimated time: **8 minutes**. All accessible facilities along route are available. A volunteer escort (Unit W-7) has been dispatched to P3 entrance.",
    tags: ['Accessibility', 'Maps API', 'Volunteer'],
  },
}

function TypingText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { setDone(true); clearInterval(timer) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  const renderFormatted = (raw: string) => {
    const parts = raw.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gold font-semibold">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <span>
      {renderFormatted(displayed)}
      {!done && <span className="inline-block w-0.5 h-4 bg-gold animate-pulse ml-0.5 align-middle" />}
    </span>
  )
}

export function AIDemoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(DEMO_PROMPTS[0])
  const [typing, setTyping] = useState(false)
  const [key, setKey] = useState(0)

  const selectPrompt = (p: string) => {
    setTyping(true)
    setActive(p)
    setKey(k => k + 1)
    setTimeout(() => setTyping(false), 100)
  }

  return (
    <section ref={ref} className="py-24 relative" aria-label="AI Demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-emerald tracking-widest uppercase mb-3 block">Gemini AI Demo</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance mb-4">
            Ask Anything.<br />
            <span className="gold-text">Get Instant Intelligence.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Experience the StadiumVerse AI assistant — powered by Gemini Pro with real-time stadium data context.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Prompt selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-2">Try These Prompts</p>
            {DEMO_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => selectPrompt(p)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  active === p
                    ? 'glass glow-border-gold text-foreground'
                    : 'glass border-border/30 text-muted-foreground hover:text-foreground hover:border-gold/30'
                }`}
              >
                {p}
              </button>
            ))}

            <Link
              href="/ai-assistant"
              className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-gradient text-black font-semibold text-sm hover:scale-105 transition-transform"
            >
              <Bot className="w-4 h-4" aria-hidden="true" />
              Open Full AI Assistant
            </Link>
          </motion.div>

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="glass glow-border-gold rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-glass-border">
              <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" aria-hidden="true" />
              </div>
              <div>
                <div className="font-semibold text-sm">Gemini Stadium AI</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                  Online · Vertex AI
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold font-mono">Gemini Pro</span>
                <Globe2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Mic className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 min-h-64 flex flex-col gap-4">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gold/20 border border-gold/30 text-sm text-foreground">
                  {active}
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                </div>
                <div className="flex-1 glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed">
                  <TypingText key={key} text={DEMO_RESPONSES[active]?.text ?? ''} speed={15} />

                  {/* Tags */}
                  {DEMO_RESPONSES[active] && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {DEMO_RESPONSES[active].tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-emerald/15 text-emerald font-mono">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 border border-gold/20">
                <input
                  readOnly
                  value="Ask about any stadium operation..."
                  className="flex-1 bg-transparent text-sm text-muted-foreground outline-none cursor-default"
                  aria-label="AI chat input (demo)"
                />
                <button className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0" aria-label="Send message">
                  <Send className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

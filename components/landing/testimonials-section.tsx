'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "StadiumVerse AI transformed how we manage 94,000 fans simultaneously. The predictive crowd analytics prevented 3 potential bottlenecks in the first match alone.",
    name: 'Carlos Rodrigues',
    role: 'Stadium Operations Director, FIFA',
    initials: 'CR',
    color: 'gold',
  },
  {
    quote: "The Gemini AI assistant handled over 50,000 fan queries in real-time across 14 languages during Match Day 1. The multilingual capability is extraordinary.",
    name: 'Sarah Chen',
    role: 'Head of Fan Experience, FIFA 2026',
    initials: 'SC',
    color: 'emerald',
  },
  {
    quote: "Our medical response time improved by 40% using the AI alert system. The nearest defibrillator routing and volunteer dispatch are genuinely life-saving features.",
    name: 'Dr. Marco Alvarez',
    role: 'Chief Medical Officer, World Cup 2026',
    initials: 'MA',
    color: 'blue',
  },
  {
    quote: "The zero-trust security architecture and Cloud Armor integration gives us military-grade protection. Not a single security incident across 6 venues.",
    name: 'James Okafor',
    role: 'Chief Security Officer, Venue Operations',
    initials: 'JO',
    color: 'gold',
  },
  {
    quote: "BigQuery analytics provided real-time revenue and vendor performance data that directly improved our concession operations by 28% in revenue per fan.",
    name: 'Aisha Patel',
    role: 'Commercial Director, FIFA 2026',
    initials: 'AP',
    color: 'emerald',
  },
  {
    quote: "As a wheelchair user, the accessible route navigation was flawless. The volunteer escort system and real-time elevator status made attending the World Cup effortless.",
    name: 'Thomas Müller',
    role: 'Accessibility Advocate & Fan',
    initials: 'TM',
    color: 'blue',
  },
]

const colorMap: Record<string, { ring: string; text: string; bg: string }> = {
  gold:    { ring: 'ring-gold/40',        text: 'text-gold',        bg: 'bg-gold/20' },
  emerald: { ring: 'ring-emerald/40',     text: 'text-emerald',     bg: 'bg-emerald/20' },
  blue:    { ring: 'ring-blue-accent/40', text: 'text-blue-accent', bg: 'bg-blue-accent/20' },
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 relative" aria-label="Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-gold tracking-widest uppercase mb-3 block">Trusted by FIFA 2026</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            What the World Is Saying
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From stadium directors to fans — StadiumVerse AI is changing the World Cup experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ quote, name, role, initials, color }, i) => {
            const c = colorMap[color]
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="glass glow-border-gold rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${c.bg} ring-2 ${c.ring} flex items-center justify-center text-xs font-bold ${c.text}`}>
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPONSORS = [
  { name: 'Google Cloud', subtitle: 'Technology Partner' },
  { name: 'FIFA', subtitle: 'Tournament Organizer' },
  { name: 'Vertex AI', subtitle: 'AI Infrastructure' },
  { name: 'Gemini', subtitle: 'Foundation Model' },
  { name: 'BigQuery', subtitle: 'Data Analytics' },
  { name: 'Firebase', subtitle: 'Auth + Database' },
  { name: 'Adidas', subtitle: 'Official Sponsor' },
  { name: 'Visa', subtitle: 'Payment Partner' },
]

export function SponsorsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-16 relative border-t border-border/30" aria-label="Sponsors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs font-mono text-muted-foreground/50 tracking-widest uppercase text-center mb-8"
        >
          Powered by & Partnered with
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SPONSORS.map(({ name, subtitle }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-border/30 hover:border-gold/30 transition-colors group"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-gold transition-colors">{name}</span>
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

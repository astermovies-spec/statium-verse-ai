'use client'

import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: 48, suffix: '', label: 'Match Days', description: 'Across 16 world-class venues' },
  { value: 3.2, suffix: 'M+', label: 'Fans Served', description: 'Real-time AI assistance' },
  { value: 99.97, suffix: '%', label: 'AI Uptime', description: 'Zero-downtime deployment' },
  { value: 120, suffix: '+', label: 'Languages', description: 'Gemini multilingual AI' },
  { value: 50, suffix: 'ms', label: 'Response Time', description: 'Edge-deployed AI inference' },
  { value: 16, suffix: '', label: 'Host Cities', description: 'USA, Canada & Mexico' },
]

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const isDecimal = value % 1 !== 0
    const duration = 1800
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, value)
      setDisplay(isDecimal ? parseFloat(current.toFixed(2)) : Math.floor(current))
      if (step >= steps) { setDisplay(value); clearInterval(timer) }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span>
      {typeof display === 'number' && display % 1 !== 0 ? display.toFixed(2) : display}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 relative" aria-label="Platform Statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono text-gold tracking-widest uppercase mb-3 block">Platform Scale</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Built for the World&apos;s Biggest Stage
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map(({ value, suffix, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass glow-border-gold rounded-2xl p-5 text-center group hover:scale-105 transition-all duration-300 cursor-default"
            >
              <div className="text-3xl sm:text-4xl font-bold gold-text font-mono mb-1">
                <AnimatedNumber value={value} suffix={suffix} inView={inView} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
              <div className="text-xs text-muted-foreground text-pretty">{description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

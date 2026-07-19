'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, Play, Zap, Globe2, Users, Activity } from 'lucide-react'

const LIVE_STATS = [
  { label: 'Fans Connected', value: '94,218', icon: Users, color: 'text-gold' },
  { label: 'AI Predictions', value: '12,847', icon: Activity, color: 'text-emerald' },
  { label: 'Stadiums Online', label2: '', value: '16 / 16', icon: Globe2, color: 'text-blue-accent' },
]

function LivePulse() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
      </span>
      <span className="text-emerald text-xs font-mono font-semibold tracking-widest uppercase">Live</span>
    </span>
  )
}

function CountUp({ target, duration = 2000 }: { target: string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    const numeric = parseInt(target.replace(/[^0-9]/g, ''), 10)
    if (isNaN(numeric)) { setDisplay(target); return }
    const steps = 60
    const increment = numeric / steps
    let current = 0
    let step = 0
    const interval = setInterval(() => {
      step++
      current = Math.min(current + increment, numeric)
      const formatted = Math.floor(current).toLocaleString()
      setDisplay(target.includes('/') ? target : formatted)
      if (step >= steps) { setDisplay(target); clearInterval(interval) }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target, duration])

  return <span>{display}</span>
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { user, isSimulated } = useAuth()

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden"
      aria-label="Hero"
    >
      {/* Stadium grid overlay */}
      <div className="absolute inset-0 stadium-grid opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Radial gradient spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 70%, oklch(0.78 0.17 55 / 8%) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border-gold mb-8"
        >
          <LivePulse />
          <span className="text-sm text-muted-foreground">Google Cloud Gen AI Hackathon 2026</span>
          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-semibold">Winner</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05] mb-6"
        >
          <span className="gold-text">StadiumVerse</span>
          <br />
          <span className="text-foreground">AI Platform</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto text-pretty mb-4"
        >
          One AI Platform. Every Fan. Every Match. Every Second.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm sm:text-base text-muted-foreground/70 max-w-2xl mx-auto mb-10"
        >
          Powered by Gemini AI, Vertex AI, and Google Cloud — the world&apos;s most advanced Smart Stadium
          and Tournament Operations Platform for FIFA World Cup 2026.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href={'/dashboard'}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl gold-gradient text-black font-semibold text-base shadow-2xl gold-glow hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            Open Command Center
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
          <Link
            href="/ai-assistant"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl glass glow-border-emerald text-foreground font-semibold text-base hover:scale-105 transition-all duration-200"
          >
            <Play className="w-4 h-4 text-emerald" aria-hidden="true" />
            Try Gemini AI
          </Link>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {LIVE_STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass glow-border-gold rounded-2xl p-4 text-center group hover:scale-105 transition-transform cursor-default"
            >
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} aria-hidden="true" />
              <div className={`text-2xl font-bold font-mono ${color}`}>
                <CountUp target={value} duration={1800} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard preview hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-xs text-muted-foreground/50 font-mono tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            aria-hidden="true"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>

      {/* Floating football particles decorations */}
      <motion.div
        className="absolute top-1/4 left-8 w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center animate-float opacity-30"
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-full border border-gold/40" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-12 w-10 h-10 rounded-full border border-emerald/30 animate-float-delayed opacity-40"
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-6 h-6 rounded-full bg-gold/10 animate-float-slow opacity-50"
        aria-hidden="true"
      />
    </section>
  )
}

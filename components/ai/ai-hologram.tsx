'use client'

import { motion } from 'framer-motion'
import { Sparkles, Activity, ShieldCheck, HelpCircle } from 'lucide-react'

interface AIHologramProps {
  status?: 'idle' | 'listening' | 'thinking'
  modeName?: string
}

export function AIHologram({ status = 'idle', modeName = 'Core Operations' }: AIHologramProps) {
  return (
    <div className="glass-dark border border-gold/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl" id="ai-hologram-assistant">
      {/* Visual background lights representing turf field and gold trophies */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald/10 via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald/10 rounded-full blur-2xl pointer-events-none" />

      {/* Grid overlay for high-tech feeling */}
      <div className="absolute inset-0 stadium-grid opacity-10 pointer-events-none" />

      {/* Soundwave/Hologram visual core */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-3">
        {/* Apple Vision Pro Glass Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-gold/30"
          animate={{
            rotate: 360,
            scale: status === 'listening' ? [1, 1.06, 1] : status === 'thinking' ? [1, 0.95, 1.05, 1] : 1,
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Second Outer Counter-rotating Emerald Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-dashed border-emerald/40"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Wave Rings / Pulsating Ripples */}
        <div className="absolute inset-4 flex items-center justify-center">
          <AnimatePresenceWave active={status !== 'idle'} color="border-gold/30" delay={0} />
          <AnimatePresenceWave active={status === 'listening'} color="border-emerald/40" delay={0.4} />
          <AnimatePresenceWave active={status === 'thinking'} color="border-blue-accent/30" delay={0.2} />
        </div>

        {/* Glowing Central AI Core Sphere */}
        <motion.div
          className="w-12 h-12 rounded-full gold-gradient shadow-2xl flex items-center justify-center relative z-10 gold-glow"
          animate={{
            scale: status === 'listening' ? [1, 1.15, 1] : status === 'thinking' ? [1, 0.9, 1.1, 1] : [1, 1.05, 1],
          }}
          transition={{
            duration: status === 'listening' ? 1.2 : status === 'thinking' ? 1.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Internal neon star */}
          <Sparkles className="w-5 h-5 text-black" aria-hidden="true" />

          {/* Core volumetric scan beam */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-emerald/40 to-transparent animate-spin" style={{ animationDuration: '3s' }} />
        </motion.div>

        {/* Small floating orbit satellites representing multi-agent tasks (Formula 1 Dashboard) */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-gold"
          style={{ x: 42, y: -42 }}
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-emerald"
          style={{ x: -38, y: 38 }}
          animate={{
            rotate: -360,
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Status Indicators & Metadata (Tesla Interface / F1 Style) */}
      <div className="text-center w-full relative z-10">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-gold-muted block mb-1">
          Holographic Assistant
        </span>
        <div className="flex items-center justify-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'listening' ? 'bg-destructive' : status === 'thinking' ? 'bg-blue-accent' : 'bg-emerald'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'listening' ? 'bg-destructive' : status === 'thinking' ? 'bg-blue-accent' : 'bg-emerald'}`} />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            {status === 'listening' ? 'MIC_ACTIVE_RECORD' : status === 'thinking' ? 'GEMINI_INFERENCE' : 'AI_SYS_STANDBY'}
          </span>
        </div>

        {/* Telemetry metadata footer bar (Stripe/Formula 1) */}
        <div className="mt-3 pt-2.5 border-t border-gold/10 grid grid-cols-2 gap-2 text-left">
          <div>
            <span className="text-[9px] text-muted-foreground block font-mono">LATENCY</span>
            <span className="text-xs font-mono font-semibold text-emerald">18.4ms</span>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block font-mono">AGENT_MODE</span>
            <span className="text-xs font-mono font-semibold text-gold truncate block max-w-[80px]">{modeName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatePresenceWave({ active, color, delay }: { active: boolean; color: string; delay: number }) {
  if (!active) return null

  return (
    <motion.div
      className={`absolute inset-0 rounded-full border ${color}`}
      initial={{ scale: 0.6, opacity: 0.8 }}
      animate={{ scale: 1.4, opacity: 0 }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeOut',
        delay
      }}
    />
  )
}

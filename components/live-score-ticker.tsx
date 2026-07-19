'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, Trophy, Flame, Zap, ShieldAlert, Cpu } from 'lucide-react'

interface TickerItem {
  id: string
  type: 'match' | 'system' | 'weather' | 'ai'
  content: string
  badge?: string
  badgeColor?: string
}

const INITIAL_ITEMS: TickerItem[] = [
  { id: 't1', type: 'match', content: 'MetLife Stadium: Argentina vs France — 2 : 1', badge: 'LIVE 78\'', badgeColor: 'bg-emerald text-black font-extrabold animate-pulse' },
  { id: 't2', type: 'ai', content: 'Gemini Match Win Predictor: ARG 74% | FRA 12% | DRAW 14%', badge: 'AI MODEL', badgeColor: 'bg-gold text-black font-bold' },
  { id: 't3', type: 'weather', content: 'Field Telemetry: 72°F (22°C) | Humidity: 54% | Pitch Condition: PRISTINE', badge: 'PITCH SENSORS', badgeColor: 'bg-blue-accent/20 text-blue-accent border border-blue-accent/30' },
  { id: 't4', type: 'system', content: 'Gate Inflow Status: GATE A: 89% | GATE B: 45% | GATE C: 91% (Diverting to D)', badge: 'CROWD FLOW', badgeColor: 'bg-amber-400/20 text-amber-400 border border-amber-400/30' },
  { id: 't5', type: 'match', content: 'SoFi Stadium: USA vs England — 1 : 1', badge: 'LIVE 42\'', badgeColor: 'bg-emerald text-black font-extrabold animate-pulse' },
]

export function LiveScoreTicker() {
  const [items, setItems] = useState<TickerItem[]>(INITIAL_ITEMS)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Simulation updates for live match times and gate throughput
  useEffect(() => {
    const timer = setInterval(() => {
      // Rotate index
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)

    const dataTimer = setInterval(() => {
      // Simulate slight score variations or time increments
      setItems((prev) =>
        prev.map((item) => {
          if (item.type === 'match' && item.content.includes('Argentina')) {
            // increment minutes
            const match = item.content.match(/(.*vs.*—\s)(\d\s:\s\d)/)
            const minutesMatch = item.badge?.match(/(\d+)/)
            if (minutesMatch) {
              const nextMin = Math.min(90, parseInt(minutesMatch[1], 10) + 1)
              return {
                ...item,
                badge: `LIVE ${nextMin}'`,
              }
            }
          }
          if (item.type === 'system') {
            // slight throughput variation
            const randomFlow = Math.floor(Math.random() * 20) + 40
            return {
              ...item,
              content: `Gate Inflow Status: GATE A: ${Math.floor(Math.random() * 15) + 80}% | GATE B: ${randomFlow}% | GATE C: ${Math.floor(Math.random() * 10) + 85}% (Diverting to D)`
            }
          }
          return item
        })
      )
    }, 15000)

    return () => {
      clearInterval(timer)
      clearInterval(dataTimer)
    }
  }, [items.length])

  return (
    <div className="w-full bg-black/60 border-b border-gold/15 backdrop-blur-md h-9 flex items-center justify-between px-4 sm:px-6 z-[60] relative overflow-hidden" id="live-score-ticker">
      {/* Ticker side indicators */}
      <div className="flex items-center gap-2 flex-shrink-0 z-10 select-none">
        <Trophy className="w-3.5 h-3.5 text-gold animate-pulse" aria-hidden="true" />
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-gold">
          FIFA World Cup 2026
        </span>
        <div className="h-3 w-[1px] bg-gold/30 hidden sm:block" />
        <span className="text-[9px] font-mono text-muted-foreground hidden sm:inline-block">
          EAST METLIFE OPERATIONS
        </span>
      </div>

      {/* Main active item carousel */}
      <div className="flex-1 flex justify-center items-center overflow-hidden px-4">
        
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex items-center gap-2 max-w-full text-center"
          >
            {items[currentIndex].badge && (
              <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${items[currentIndex].badgeColor}`}>
                {items[currentIndex].badge}
              </span>
            )}
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-foreground truncate max-w-[280px] sm:max-w-md md:max-w-xl">
              {items[currentIndex].content}
            </span>
          </motion.div>
        
      </div>

      {/* Right-side quick metric */}
      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 z-10 select-none">
        <Cpu className="w-3.5 h-3.5 text-emerald" aria-hidden="true" />
        <span className="text-[10px] font-mono text-emerald font-black uppercase tracking-wider">
          Vertex AI Active
        </span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald" />
        </span>
      </div>
    </div>
  )
}

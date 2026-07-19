'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Activity, Zap, Leaf, Car, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPI {
  label: string
  value: string
  change: number
  unit: string
  icon: React.ElementType
  color: string
  status: 'good' | 'warn' | 'critical'
}

const BASE_KPIS: KPI[] = [
  { label: 'Attendance', value: '78,240', change: 4.2, unit: '/ 94,218 capacity', icon: Users, color: 'gold', status: 'good' },
  { label: 'AI Queries', value: '12,847', change: 18.6, unit: 'last 60 min', icon: Activity, color: 'emerald', status: 'good' },
  { label: 'Energy Usage', value: '4.2', change: -8.1, unit: 'MW · green certified', icon: Zap, color: 'blue', status: 'good' },
  { label: 'Carbon Index', value: '0.24', change: -12.4, unit: 'kg CO₂ per fan', icon: Leaf, color: 'emerald', status: 'good' },
  { label: 'Parking Zones', value: '3 / 8', change: 0, unit: 'zones at capacity', icon: Car, color: 'gold', status: 'warn' },
  { label: 'Active Alerts', value: '2', change: 0, unit: 'require attention', icon: AlertTriangle, color: 'red', status: 'warn' },
]

const colorMap: Record<string, { border: string; icon: string; bg: string; text: string }> = {
  gold:    { border: 'glow-border-gold',    icon: 'text-gold',        bg: 'bg-gold/10',        text: 'text-gold' },
  emerald: { border: 'glow-border-emerald', icon: 'text-emerald',     bg: 'bg-emerald/10',     text: 'text-emerald' },
  blue:    { border: 'border border-blue-accent/30', icon: 'text-blue-accent', bg: 'bg-blue-accent/10', text: 'text-blue-accent' },
  red:     { border: 'border border-destructive/30', icon: 'text-destructive', bg: 'bg-destructive/10', text: 'text-destructive' },
}

function LiveValue({ base, label }: { base: string; label: string }) {
  const [val, setVal] = useState(base)

  useEffect(() => {
    if (!['Attendance', 'AI Queries'].includes(label)) return
    const interval = setInterval(() => {
      const numeric = parseInt(base.replace(/,/g, ''), 10)
      const delta = Math.floor((Math.random() - 0.45) * 15)
      const updated = Math.max(0, numeric + delta).toLocaleString()
      setVal(updated)
    }, 3000)
    return () => clearInterval(interval)
  }, [base, label])

  return <span>{val}</span>
}

export function KPICards() {
  return (
    <section aria-label="Key Performance Indicators">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {BASE_KPIS.map(({ label, value, change, unit, icon: Icon, color, status }, i) => {
          const c = colorMap[color]
          const isPositive = change > 0
          const isNeutral = change === 0
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass ${c.border} rounded-2xl p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform cursor-default`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${c.icon}`} aria-hidden="true" />
                </div>
                {!isNeutral && (
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-xs font-mono font-semibold',
                      isPositive ? 'text-emerald' : 'text-destructive'
                    )}
                    aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(change)}%`}
                  >
                    {isPositive ? <TrendingUp className="w-3 h-3" aria-hidden="true" /> : <TrendingDown className="w-3 h-3" aria-hidden="true" />}
                    {Math.abs(change)}%
                  </span>
                )}
                {status === 'warn' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-label="Warning" />
                )}
              </div>
              <div>
                <div className={`text-xl font-bold font-mono ${c.text}`}>
                  <LiveValue base={value} label={label} />
                </div>
                <div className="text-xs font-semibold text-foreground mt-0.5">{label}</div>
                <div className="text-xs text-muted-foreground">{unit}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

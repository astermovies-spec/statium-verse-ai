'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CloudSun, Wind, Droplets, Thermometer } from 'lucide-react'

const MATCHES = [
  { team1: 'Brazil', team2: 'France', time: 'LIVE · 72\'', score: '2 - 1', venue: 'MetLife Stadium', status: 'live' },
  { team1: 'Germany', team2: 'Argentina', time: '19:00 EST', score: 'vs', venue: 'SoFi Stadium', status: 'upcoming' },
  { team1: 'Spain', team2: 'England', time: '22:00 EST', score: 'vs', venue: 'AT&T Stadium', status: 'upcoming' },
]

const FLAGS: Record<string, string> = {
  Brazil: '🇧🇷', France: '🇫🇷', Germany: '🇩🇪', Argentina: '🇦🇷', Spain: '🇪🇸', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
}

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])
  return <span className="font-mono text-gold text-sm">{time}</span>
}

export function MatchWidget() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Match status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glow-border-gold rounded-2xl p-5"
        aria-label="Today's Matches"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Today&apos;s Matches</h3>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <LiveClock />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {MATCHES.map(({ team1, team2, time, score, venue, status }) => (
            <div
              key={`${team1}-${team2}`}
              className={`flex items-center gap-3 p-3 rounded-xl ${status === 'live' ? 'bg-gold/10 border border-gold/30' : 'bg-muted/10 border border-border/20'}`}
            >
              <div className="flex-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <span role="img" aria-label={team1}>{FLAGS[team1]}</span>
                  <span className="font-medium">{team1}</span>
                </div>
                <div className="text-center">
                  <div className={`font-bold font-mono text-sm ${status === 'live' ? 'text-gold' : 'text-muted-foreground'}`}>
                    {score}
                  </div>
                  <div className="text-xs text-muted-foreground">{time}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{team2}</span>
                  <span role="img" aria-label={team2}>{FLAGS[team2]}</span>
                </div>
              </div>
              {status === 'live' && (
                <span className="flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-destructive opacity-75" aria-hidden="true" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass glow-border-emerald rounded-2xl p-5"
        aria-label="Stadium Weather"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Stadium Weather</h3>
          <span className="text-xs text-muted-foreground">MetLife Stadium</span>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold gold-text">24</span>
              <span className="text-2xl text-muted-foreground mb-2">°C</span>
            </div>
            <p className="text-sm text-muted-foreground">Partly cloudy, ideal conditions</p>
          </div>
          <CloudSun className="w-16 h-16 text-gold opacity-80" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Wind, label: 'Wind', value: '12 km/h', color: 'text-blue-accent' },
            { icon: Droplets, label: 'Humidity', value: '58%', color: 'text-blue-accent' },
            { icon: Thermometer, label: 'Feels like', value: '26°C', color: 'text-gold' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/10">
              <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              <span className="text-xs font-mono font-semibold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

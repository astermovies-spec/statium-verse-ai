'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Shield, Activity, Users, Ticket, Heart, Zap,
  Search, Filter, RefreshCw, AlertTriangle, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedItem {
  id: string
  time: string
  category: 'security' | 'medical' | 'crowd' | 'ticketing' | 'operations'
  message: string
  severity: 'info' | 'warn' | 'critical'
  resolved: boolean
}

const INITIAL_FEED: FeedItem[] = [
  { id: 'F-105', time: '16:02:41', category: 'crowd', message: 'Heavy crowd build-up detected at Concourse West, Gate D', severity: 'warn', resolved: false },
  { id: 'F-104', time: '15:58:12', category: 'medical', message: 'Medical emergency dispatch to Sector 212 - First aid active', severity: 'critical', resolved: false },
  { id: 'F-103', time: '15:55:04', category: 'ticketing', message: 'Gate B turnstile scanner 4 re-calibrated successfully', severity: 'info', resolved: true },
  { id: 'F-102', time: '15:48:33', category: 'security', message: 'Unresolved baggage report at Section 104 - Security team onsite', severity: 'warn', resolved: false },
  { id: 'F-101', time: '15:45:19', category: 'operations', message: 'VIP Lounge L3 climate control normalized', severity: 'info', resolved: true },
  { id: 'F-100', time: '15:30:10', category: 'crowd', message: 'Inflow at North Stand gates stabilizing', severity: 'info', resolved: true },
]

const CATEGORY_ICONS = {
  security: Shield,
  medical: Heart,
  crowd: Users,
  ticketing: Ticket,
  operations: Zap,
}

const SEVERITY_STYLES = {
  info: 'bg-blue-accent/15 border-blue-accent/30 text-blue-accent',
  warn: 'bg-amber-400/15 border-amber-400/30 text-amber-400',
  critical: 'bg-destructive/15 border-destructive/30 text-destructive',
}

const SIMULATED_ALERTS = [
  { category: 'crowd', message: 'West Gate C experiencing a sudden 20% spike in scanner throughput', severity: 'warn' },
  { category: 'security', message: 'Gate A zone 3 CCTV camera connection re-established', severity: 'info' },
  { category: 'medical', message: 'Heat risk threshold exceeded in South Stand - Fan hydration alerts sent', severity: 'warn' },
  { category: 'operations', message: 'Volunteer team 4 dispatched to assist with translation at East Gate B', severity: 'info' },
  { category: 'ticketing', message: 'Digital ticket API latency warning: Response time > 800ms', severity: 'critical' },
]

export function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warn' | 'critical'>('all')

  // Simulate incoming real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random simulated alert
      const randomAlert = SIMULATED_ALERTS[Math.floor(Math.random() * SIMULATED_ALERTS.length)]
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
      const newId = `F-${Math.floor(Math.random() * 900) + 200}`
      
      const newItem: FeedItem = {
        id: newId,
        time: timestamp,
        category: randomAlert.category as any,
        message: randomAlert.message,
        severity: randomAlert.severity as any,
        resolved: false
      }

      setFeed(prev => [newItem, ...prev.slice(0, 9)])
    }, 12000) // update every 12 seconds

    return () => clearInterval(interval)
  }, [])

  const handleResolve = (id: string) => {
    setFeed(prev => prev.map(item => item.id === id ? { ...item, resolved: true } : item))
  }

  const handleTriggerMockAlert = () => {
    const randomAlert = SIMULATED_ALERTS[Math.floor(Math.random() * SIMULATED_ALERTS.length)]
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false })
    const newId = `F-${Math.floor(Math.random() * 900) + 200}`
    
    const newItem: FeedItem = {
      id: newId,
      time: timestamp,
      category: randomAlert.category as any,
      message: randomAlert.message,
      severity: randomAlert.severity as any,
      resolved: false
    }
    setFeed(prev => [newItem, ...prev])
  }

  const filteredFeed = feed.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(search.toLowerCase()) || 
                          item.category.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="glass glow-border-gold rounded-2xl p-5 space-y-4" id="live-feed-section">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gold animate-bounce" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold text-foreground">Live Command & Telemetry Feed</h3>
            <p className="text-xs text-muted-foreground">Real-time stadium logs & event coordination center</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerMockAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/30 text-xs font-semibold text-gold hover:bg-gold/25 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            Trigger Test Alert
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search telemetry feed..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl glass border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 font-medium"
            aria-label="Search telemetry logs"
          />
        </div>
        
        {/* Severity filter buttons */}
        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Severity filter">
          {(['all', 'info', 'warn', 'critical'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap',
                severityFilter === sev 
                  ? 'gold-gradient text-black' 
                  : 'glass border border-border/30 text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={severityFilter === sev}
            >
              {sev === 'all' ? 'All Severities' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="relative overflow-hidden min-h-[250px] max-h-[400px] overflow-y-auto rounded-xl border border-border/10 pr-1">
        <div className="divide-y divide-border/10">
          
            {filteredFeed.map(item => {
              const Icon = CATEGORY_ICONS[item.category] || Activity
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={cn(
                    "p-4 flex items-start gap-3 transition-colors",
                    item.resolved ? "opacity-60 bg-muted/2" : "hover:bg-muted/5"
                  )}
                  role="listitem"
                >
                  {/* Icon Badge */}
                  <div className={cn("p-2 rounded-xl flex-shrink-0 border", SEVERITY_STYLES[item.severity])}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-muted-foreground">{item.id}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/60">{item.time}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.resolved ? (
                        <span className="text-[10px] font-semibold text-emerald flex items-center gap-1 bg-emerald/10 border border-emerald/20 px-1.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        item.severity === 'critical' && (
                          <span className="text-[10px] font-semibold text-destructive flex items-center gap-1 bg-destructive/10 border border-destructive/20 px-1.5 py-0.5 rounded-full animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Action Required
                          </span>
                        )
                      )}
                    </div>
                    <p className={cn(
                      "text-sm font-semibold",
                      item.resolved ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {item.message}
                    </p>
                  </div>

                  {/* Actions */}
                  {!item.resolved && (
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="flex-shrink-0 self-center px-3 py-1 rounded-lg bg-emerald/15 border border-emerald/30 text-emerald text-xs font-semibold hover:bg-emerald/25 transition-all"
                    >
                      Resolve
                    </button>
                  )}
                </motion.div>
              )
            })}
          
          {filteredFeed.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No telemetry entries found matching current criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

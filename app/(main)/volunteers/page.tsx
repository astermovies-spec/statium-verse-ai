'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, MapPin, CheckCircle2, Clock, Star, Search,
  Filter, RefreshCw, Zap, Radio, Bell,
} from 'lucide-react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { StadiumBackground } from '@/components/stadium-background'
import { cn } from '@/lib/utils'

type VolStatus = 'active' | 'break' | 'standby'
interface Volunteer {
  id: string
  name: string
  zone: string
  role: string
  status: VolStatus
  tasksCompleted: number
  rating: number
  shift: string
}

const VOLUNTEERS: Volunteer[] = [
  { id: 'V-001', name: 'Maria Santos', zone: 'Gate C', role: 'Entry Management', status: 'active', tasksCompleted: 24, rating: 4.9, shift: '08:00–18:00' },
  { id: 'V-002', name: 'James Okafor', zone: 'West Stand', role: 'Fan Assistance', status: 'active', tasksCompleted: 18, rating: 4.8, shift: '08:00–18:00' },
  { id: 'V-003', name: 'Sofia Hernandez', zone: 'Food Zone F3', role: 'Concession Support', status: 'break', tasksCompleted: 31, rating: 4.7, shift: '10:00–20:00' },
  { id: 'V-004', name: 'Luca Ferrari', zone: 'VIP Area', role: 'VIP Concierge', status: 'active', tasksCompleted: 12, rating: 5.0, shift: '12:00–22:00' },
  { id: 'V-005', name: 'Amara Diallo', zone: 'Gate A', role: 'Accessibility Guide', status: 'active', tasksCompleted: 9, rating: 4.9, shift: '08:00–18:00' },
  { id: 'V-006', name: 'Chen Wei', zone: 'South Stand', role: 'Language Support', status: 'standby', tasksCompleted: 6, rating: 4.6, shift: '10:00–20:00' },
  { id: 'V-007', name: 'Emma Müller', zone: 'Lost & Found', role: 'Lost Property', status: 'active', tasksCompleted: 41, rating: 4.8, shift: '08:00–18:00' },
  { id: 'V-008', name: 'Raj Patel', zone: 'Parking P4', role: 'Traffic Management', status: 'active', tasksCompleted: 22, rating: 4.7, shift: '06:00–16:00' },
]

const TASKS = [
  { id: 'T-001', type: 'Accessibility request', location: 'Gate B', urgency: 'high', volunteer: null },
  { id: 'T-002', type: 'Lost child report', location: 'North Stand', urgency: 'critical', volunteer: null },
  { id: 'T-003', type: 'Spill cleanup', location: 'Food Zone F7', urgency: 'low', volunteer: 'V-003' },
  { id: 'T-004', type: 'Translation needed', location: 'Gate C', urgency: 'medium', volunteer: null },
  { id: 'T-005', type: 'Seating dispute', location: 'East Stand', urgency: 'medium', volunteer: 'V-002' },
]

const STATUS_CFG: Record<VolStatus, { label: string; bg: string; text: string }> = {
  active:  { label: 'Active',   bg: 'bg-emerald/15',     text: 'text-emerald' },
  break:   { label: 'Break',    bg: 'bg-amber-400/15',   text: 'text-amber-400' },
  standby: { label: 'Standby',  bg: 'bg-muted/30',       text: 'text-muted-foreground' },
}

const URGENCY_CFG: Record<string, { bg: string; text: string }> = {
  critical: { bg: 'bg-destructive/15', text: 'text-destructive' },
  high:     { bg: 'bg-amber-400/15',   text: 'text-amber-400' },
  medium:   { bg: 'bg-blue-accent/15', text: 'text-blue-accent' },
  low:      { bg: 'bg-muted/30',       text: 'text-muted-foreground' },
}

export default function VolunteersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VolStatus | 'all'>('all')
  const [tasks, setTasks] = useState(TASKS)

  const filtered = VOLUNTEERS.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.zone.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = VOLUNTEERS.filter(v => v.status === 'active').length
  const openTasks = tasks.filter(t => !t.volunteer).length

  return (
    <div className="relative min-h-screen flex">
      <StadiumBackground />
      <Sidebar />
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="glass border-b border-border/30 px-5 py-4 flex flex-wrap items-center gap-3">
          <Users className="w-5 h-5 text-gold" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Volunteer Coordination</h1>
            <p className="text-xs text-muted-foreground">1,200 volunteers · Real-time task dispatch · FIFA World Cup 2026</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 border border-gold/30 text-xs font-semibold text-gold">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {activeCount} On Duty
            </div>
            {openTasks > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-xs font-semibold text-amber-400">
                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                {openTasks} Open Tasks
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Active Volunteers', value: String(activeCount), color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/30' },
              { label: 'On Break', value: String(VOLUNTEERS.filter(v => v.status === 'break').length), color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
              { label: 'Open Tasks', value: String(openTasks), color: 'text-gold', bg: 'bg-gold/10 border-gold/30' },
              { label: 'Avg Rating', value: '4.82', color: 'text-blue-accent', bg: 'bg-blue-accent/10 border-blue-accent/30' },
            ].map(({ label, value, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn('glass rounded-2xl border p-4', bg)}
              >
                <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Volunteer List */}
            <section className="xl:col-span-2 glass glow-border-gold rounded-2xl flex flex-col" aria-label="Volunteer list">
              <div className="px-5 py-4 border-b border-border/30 flex items-center gap-3 flex-wrap">
                <h2 className="text-sm font-bold text-foreground">Deployed Volunteers</h2>
                {/* Search */}
                <div className="relative flex-1 min-w-40">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name or zone..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl glass border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40"
                    aria-label="Search volunteers"
                  />
                </div>
                {/* Status filter */}
                <div className="flex gap-1" role="group" aria-label="Status filter">
                  {(['all', 'active', 'break', 'standby'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize',
                        statusFilter === s ? 'gold-gradient text-black' : 'glass border border-border/30 text-muted-foreground hover:text-foreground'
                      )}
                      aria-pressed={statusFilter === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto">
                <table className="w-full text-xs" aria-label="Volunteers table">
                  <thead>
                    <tr className="border-b border-border/30">
                      {['Volunteer', 'Zone / Role', 'Status', 'Tasks', 'Rating', 'Shift'].map(h => (
                        <th key={h} className="text-left py-2.5 px-4 font-mono text-muted-foreground/50 uppercase tracking-widest font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v => {
                      const cfg = STATUS_CFG[v.status]
                      return (
                        <tr key={v.id} className="border-b border-border/10 hover:bg-muted/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                                {v.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{v.name}</div>
                                <div className="text-muted-foreground/60 font-mono">{v.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">{v.zone}</div>
                            <div className="text-muted-foreground/60">{v.role}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={cn('px-2 py-0.5 rounded-full font-semibold', cfg.bg, cfg.text)}>{cfg.label}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-foreground font-semibold">{v.tasksCompleted}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-gold" aria-hidden="true" />
                              <span className="font-mono text-gold font-semibold">{v.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">{v.shift}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No volunteers match your search.</p>
                )}
              </div>
            </section>

            {/* Task Dispatch */}
            <section className="flex flex-col gap-4" aria-label="Task dispatch">
              <div className="glass glow-border-gold rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Radio className="w-4 h-4 text-gold" aria-hidden="true" />
                    Live Task Queue
                  </h2>
                  <button className="p-1.5 rounded-lg glass border border-border/30 text-muted-foreground hover:text-foreground transition-colors" aria-label="Refresh tasks">
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {tasks.map(task => {
                    const cfg = URGENCY_CFG[task.urgency]
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'p-3 rounded-xl border',
                          task.volunteer ? 'glass border-border/30' : `${cfg.bg} border-current/30`
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-xs font-semibold capitalize px-1.5 py-0.5 rounded-full', cfg.bg, cfg.text)}>
                            {task.urgency}
                          </span>
                          <AnimatePresence mode="wait">
                            {task.volunteer ? (
                              <motion.span
                                key="assigned"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [0.8, 1.25, 0.95, 1], opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative text-xs text-emerald font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald/15 border border-emerald/20"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald" aria-hidden="true" />
                                <span>Assigned</span>
                                <motion.span
                                  initial={{ scale: 0.8, opacity: 0.8 }}
                                  animate={{ scale: 1.8, opacity: 0 }}
                                  transition={{ duration: 0.6, ease: "easeOut", repeat: 1 }}
                                  className="absolute inset-0 rounded-lg border border-emerald/50 pointer-events-none"
                                />
                              </motion.span>
                            ) : (
                              <motion.button
                                key="dispatch"
                                initial={{ opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, volunteer: 'V-001' } : t))}
                                className="text-xs px-2 py-0.5 rounded-lg gold-gradient text-black font-semibold flex items-center gap-1"
                              >
                                <Zap className="w-3 h-3" aria-hidden="true" />
                                Dispatch
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{task.type}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" aria-hidden="true" />
                          {task.location}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div className="glass glow-border-gold rounded-2xl p-4">
                <h2 className="text-sm font-bold text-foreground mb-3">Zone Coverage</h2>
                {[
                  { zone: 'Gate A/B/C/D', count: 80 },
                  { zone: 'North Stand', count: 120 },
                  { zone: 'South Stand', count: 115 },
                  { zone: 'East Stand', count: 130 },
                  { zone: 'West Stand', count: 145 },
                  { zone: 'Concourse', count: 200 },
                ].map(({ zone, count }) => (
                  <div key={zone} className="flex items-center gap-2 mb-2 text-xs">
                    <span className="text-muted-foreground w-28 flex-shrink-0">{zone}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded-full gold-gradient"
                        style={{ width: `${(count / 200) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-mono text-gold w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/dashboard/sidebar'
import { StadiumBackground } from '@/components/stadium-background'
import {
  Map, Users, Thermometer, Navigation, Shield, Heart,
  ShoppingBag, Coffee, Toilet, AlertTriangle, ZoomIn, ZoomOut,
  Eye, EyeOff, RefreshCw, Car, Brain, Clock, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------- Types ----------
type LayerKey = 'crowd' | 'heatmap' | 'security' | 'medical' | 'food' | 'navigation' | 'staff' | 'emergency'
type ZoneStatus = 'ok' | 'warn' | 'critical'

interface Zone {
  id: string
  label: string
  x: number // percent
  y: number // percent
  w: number
  h: number
  level: number // 0 = ground, 1 = concourse, 2 = upper
  capacity: number
  current: number
  status: ZoneStatus
  type: 'section' | 'gate' | 'concourse' | 'pitch' | 'facility' | 'parking'
}

interface Hotspot {
  id: string
  label: string
  x: number
  y: number
  level: number
  type: 'food' | 'medical' | 'security' | 'toilet' | 'exit' | 'parking' | 'volunteer'
  alert?: boolean
}

// ---------- Static Data ----------
const ZONES: Zone[] = [
  // Ground
  { id: 'p1', label: 'VIP Parking', x: 10, y: 5, w: 20, h: 20, level: 0, capacity: 500, current: 480, status: 'warn', type: 'parking' },
  { id: 'p2', label: 'East Parking', x: 70, y: 10, w: 25, h: 80, level: 0, capacity: 2000, current: 1800, status: 'warn', type: 'parking' },
  { id: 'z6', label: 'Gate A (North)', x: 43, y: -5, w: 14, h: 10, level: 0, capacity: 5000, current: 1200, status: 'ok', type: 'gate' },
  { id: 'z7', label: 'Gate B (East)', x: 95, y: 43, w: 10, h: 14, level: 0, capacity: 5000, current: 2400, status: 'ok', type: 'gate' },
  { id: 'z8', label: 'Gate C (South)', x: 43, y: 95, w: 14, h: 10, level: 0, capacity: 5000, current: 4800, status: 'critical', type: 'gate' },
  { id: 'z9', label: 'Gate D (West)', x: -5, y: 43, w: 10, h: 14, level: 0, capacity: 5000, current: 1100, status: 'ok', type: 'gate' },
  { id: 'z5', label: 'Pitch', x: 28, y: 22, w: 44, h: 56, level: 0, capacity: 0, current: 0, status: 'ok', type: 'pitch' },
  
  // Level 1
  { id: 'z1', label: 'North Stand', x: 30, y: 5, w: 40, h: 18, level: 1, capacity: 18000, current: 15200, status: 'ok', type: 'section' },
  { id: 'z2', label: 'South Stand', x: 30, y: 77, w: 40, h: 18, level: 1, capacity: 18000, current: 17800, status: 'warn', type: 'section' },
  { id: 'z3', label: 'East Stand', x: 75, y: 20, w: 20, h: 60, level: 1, capacity: 20000, current: 16400, status: 'ok', type: 'section' },
  { id: 'z4', label: 'West Stand', x: 5, y: 20, w: 20, h: 60, level: 1, capacity: 20000, current: 19600, status: 'critical', type: 'section' },
]

const HOTSPOTS: Hotspot[] = [
  { id: 'h1', label: 'Food Zone F3', x: 22, y: 35, level: 1, type: 'food' },
  { id: 'h2', label: 'Food Zone F7', x: 78, y: 65, level: 1, type: 'food' },
  { id: 'h3', label: 'Medical Bay', x: 52, y: 15, level: 1, type: 'medical' },
  { id: 'h4', label: 'First Aid', x: 52, y: 85, level: 1, type: 'medical', alert: true },
  { id: 'h5', label: 'Security Post', x: 20, y: 60, level: 1, type: 'security', alert: true },
  { id: 'h6', label: 'Security Post', x: 80, y: 40, level: 1, type: 'security' },
  { id: 'h7', label: 'Restroom', x: 65, y: 20, level: 1, type: 'toilet' },
  { id: 'h8', label: 'Restroom', x: 35, y: 80, level: 1, type: 'toilet' },
  { id: 'h9', label: 'Exit Route', x: 50, y: 50, level: 0, type: 'exit' },
  { id: 'h10', label: 'Volunteer Hub', x: 30, y: 25, level: 1, type: 'volunteer' },
  { id: 'h11', label: 'Volunteer Post', x: 70, y: 75, level: 1, type: 'volunteer' },
]

const LAYERS: { id: LayerKey; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'crowd',      label: 'Crowd Density', icon: Users,       color: 'text-gold' },
  { id: 'heatmap',    label: 'Live Heat Map', icon: Thermometer, color: 'text-orange-400' },
  { id: 'emergency',  label: 'Emergency Routes', icon: Activity, color: 'text-destructive' },
  { id: 'security',   label: 'Security Teams',icon: Shield,      color: 'text-blue-accent' },
  { id: 'medical',    label: 'Medical Teams', icon: Heart,       color: 'text-rose-400' },
  { id: 'staff',      label: 'Volunteers',    icon: Users,       color: 'text-amber-400' },
  { id: 'food',       label: 'Food & Washrooms', icon: Coffee,   color: 'text-emerald' },
  { id: 'navigation', label: 'Gates & Exits', icon: Navigation,  color: 'text-muted-foreground' },
]

const HOTSPOT_ICONS: Record<string, React.ElementType> = {
  food: ShoppingBag,
  medical: Heart,
  security: Shield,
  toilet: Toilet,
  exit: Navigation,
  parking: Car,
  volunteer: Users,
}

const STATUS_COLOR: Record<ZoneStatus, string> = {
  ok:       'bg-emerald/20 border-emerald/40',
  warn:     'bg-amber-400/20 border-amber-400/40',
  critical: 'bg-destructive/20 border-destructive/40',
}
const STATUS_TEXT: Record<ZoneStatus, string> = {
  ok:       'text-emerald',
  warn:     'text-amber-400',
  critical: 'text-destructive',
}

// ---------- Component ----------
export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set(['crowd', 'security', 'emergency', 'navigation']))
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [zoom, setZoom] = useState(0.8)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [predictionTime, setPredictionTime] = useState<number>(0) // 0 = live, 10 = +10m, 20 = +20m
  const [is3D, setIs3D] = useState(true)

  // AI predicted modifications
  const getPredictedZones = (): Zone[] => {
    return ZONES.map(z => {
      const next = { ...z }
      if (predictionTime === 10) {
        if (z.id === 'z8') { next.current = Math.min(z.capacity, z.current + 800); next.status = 'critical' }
        if (z.id === 'z4') { next.current = Math.max(0, z.current - 1000); next.status = 'warn' }
      }
      if (predictionTime === 20) {
        if (z.id === 'z8') { next.current = Math.max(0, z.current - 2000); next.status = 'ok' }
        if (z.id === 'z4') { next.current = Math.max(0, z.current - 3000); next.status = 'ok' }
        if (z.id === 'z6') { next.current = Math.min(z.capacity, z.current + 1500); next.status = 'warn' }
      }
      return next
    })
  }

  const currentZones = getPredictedZones()

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const getDensityColor = (zone: Zone) => {
    if (zone.type === 'pitch') return 'transparent'
    const ratio = zone.capacity > 0 ? zone.current / zone.capacity : 0
    if (ratio > 0.95) return 'rgba(239,68,68,0.3)'
    if (ratio > 0.80) return 'rgba(251,191,36,0.25)'
    return 'rgba(85,190,135,0.15)'
  }

  const getHeatmapColor = (zone: Zone) => {
    if (zone.type === 'pitch') return 'transparent'
    const ratio = zone.capacity > 0 ? zone.current / zone.capacity : 0
    const r = Math.round(ratio * 255)
    const g = Math.round((1 - ratio) * 200)
    return `rgba(${r},${g},50,0.4)`
  }

  return (
    <div className="relative min-h-screen flex">
      <StadiumBackground />
      <Sidebar />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-border/30 px-5 py-4 flex flex-wrap items-center gap-3">
          <Map className="w-5 h-5 text-gold" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Digital Twin</h1>
            <p className="text-xs text-muted-foreground">3D Spatial Telemetry & AI Forecasting</p>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            
            {/* AI Prediction Slider */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gold/30 bg-gold/5 mr-2">
              <Brain className="w-4 h-4 text-gold animate-pulse" />
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider mr-2">AI Forecast:</span>
              {[0, 10, 20].map(time => (
                <button
                  key={time}
                  onClick={() => setPredictionTime(time)}
                  className={cn(
                    'text-[10px] font-mono px-2 py-0.5 rounded transition-colors',
                    predictionTime === time ? 'bg-gold text-black font-bold' : 'text-muted-foreground hover:text-gold'
                  )}
                >
                  {time === 0 ? 'LIVE' : `+${time}M`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIs3D(v => !v)}
              className="px-3 py-1.5 rounded-xl glass border border-border/30 text-xs font-semibold hover:text-foreground transition-colors"
            >
              {is3D ? '2D View' : '3D View'}
            </button>
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
              className="p-2 rounded-xl glass border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
              className="p-2 rounded-xl glass border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => setZoom(0.8)}
              className="p-2 rounded-xl glass border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reset zoom"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 gap-0 overflow-hidden perspective-1000">
          {/* Layer Controls */}
          <aside className="hidden md:flex flex-col w-52 border-r border-border/30 p-4 gap-3 bg-background/60 z-20" aria-label="Map layer controls">
            <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">Active Layers</p>
            {LAYERS.map(({ id, label, icon: Icon, color }) => {
              const active = activeLayers.has(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleLayer(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                    active
                      ? 'glass border-gold/30 text-foreground'
                      : 'border-border/20 text-muted-foreground hover:text-foreground hover:border-border/40'
                  )}
                  aria-pressed={active}
                >
                  {active
                    ? <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
                    : <EyeOff className="w-4 h-4 opacity-40" aria-hidden="true" />
                  }
                  {label}
                </button>
              )
            })}

            {/* Zone legend */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest mb-3">Density Legend</p>
              {[
                { label: 'Low (0-80%)',   color: 'bg-emerald/30' },
                { label: 'High (80-95%)', color: 'bg-amber-400/30' },
                { label: 'Critical (95%+)',color: 'bg-destructive/30' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-sm ${color}`} aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Map canvas */}
          <main className="flex-1 p-4 sm:p-6 overflow-hidden relative flex items-center justify-center" aria-label="Stadium map">
            
            {/* The 3D Stage */}
            <motion.div
              className="relative"
              style={{
                width: 600,
                height: 600,
              }}
              animate={{
                scale: zoom,
                rotateX: is3D ? 60 : 0,
                rotateZ: is3D ? -45 : 0,
                y: is3D ? 50 : 0
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            >
              
              {/* Ground Level Layer (Parking, Exits, Gates, Pitch) */}
              <div className="absolute inset-0 preserve-3d" style={{ transform: 'translateZ(0px)' }}>
                <div className="absolute inset-0 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm" />
                
                {/* Emergency Route SVG */}
                {activeLayers.has('emergency') && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                    <motion.path 
                      d="M 258 258 L 258 570 L 60 570" 
                      stroke="rgba(239, 68, 68, 0.8)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray="10,10"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                    <motion.path 
                      d="M 342 258 L 342 -30 L 540 -30" 
                      stroke="rgba(239, 68, 68, 0.8)" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray="10,10"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                  </svg>
                )}

                {currentZones.filter(z => z.level === 0).map(zone => {
                  const fillColor = activeLayers.has('heatmap') ? getHeatmapColor(zone) : (activeLayers.has('crowd') ? getDensityColor(zone) : 'rgba(255,255,255,0.05)')
                  
                  if (zone.type === 'pitch') {
                    return (
                      <div
                        key={zone.id}
                        className="absolute rounded-xl bg-emerald/20 border border-emerald/40"
                        style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full border border-emerald/40" />
                          <div className="absolute w-2 h-2 rounded-full bg-emerald/60" />
                        </div>
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald/30" />
                        <div className="absolute top-[12%] left-[25%] w-[50%] h-[12%] border border-emerald/30 border-b-0" />
                        <div className="absolute bottom-[12%] left-[25%] w-[50%] h-[12%] border border-emerald/30 border-t-0" />
                      </div>
                    )
                  }

                  return (
                    <motion.button
                      key={zone.id}
                      className={cn(
                        'absolute rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold',
                        STATUS_COLOR[zone.status],
                        hoveredZone === zone.id && 'ring-2 ring-gold/60',
                        selectedZone?.id === zone.id && 'ring-2 ring-gold'
                      )}
                      style={{
                        left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`,
                        background: fillColor,
                      }}
                      onClick={() => setSelectedZone(z => z?.id === zone.id ? null : zone)}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className={cn('absolute inset-0 flex items-center justify-center text-[10px] font-bold', STATUS_TEXT[zone.status])} style={{ transform: is3D ? 'rotateZ(45deg) rotateX(-60deg)' : 'none' }}>
                        {zone.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Concourse Level 1 Layer (Sections, Food, Medical, Staff) */}
              <motion.div 
                className="absolute inset-0 preserve-3d pointer-events-none" 
                animate={{ z: is3D ? 120 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              >
                {/* Visual Glass Floor connecting the levels */}
                {is3D && (
                  <div className="absolute inset-4 rounded-3xl border-2 border-gold/10 bg-black/40 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                )}

                {currentZones.filter(z => z.level === 1).map(zone => {
                  const fillColor = activeLayers.has('heatmap') ? getHeatmapColor(zone) : (activeLayers.has('crowd') ? getDensityColor(zone) : 'rgba(255,255,255,0.05)')
                  
                  return (
                    <motion.button
                      key={zone.id}
                      className={cn(
                        'absolute rounded-lg border transition-all cursor-pointer pointer-events-auto',
                        STATUS_COLOR[zone.status],
                        hoveredZone === zone.id && 'ring-2 ring-gold/60',
                        selectedZone?.id === zone.id && 'ring-2 ring-gold'
                      )}
                      style={{
                        left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`,
                        background: fillColor,
                      }}
                      onClick={() => setSelectedZone(z => z?.id === zone.id ? null : zone)}
                      onMouseEnter={() => setHoveredZone(zone.id)}
                      onMouseLeave={() => setHoveredZone(null)}
                      whileHover={{ scale: 1.05, zIndex: 50 }}
                    >
                      <span className={cn('absolute inset-0 flex items-center justify-center text-xs font-bold', STATUS_TEXT[zone.status])} style={{ transform: is3D ? 'rotateZ(45deg) rotateX(-60deg)' : 'none' }}>
                        {zone.label.split(' ')[0]}
                      </span>
                      {zone.status !== 'ok' && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                      )}
                    </motion.button>
                  )
                })}

                {/* Hotspots Level 1 */}
                {activeLayers.has('food') && HOTSPOTS.filter(h => h.level === 1 && (h.type === 'food' || h.type === 'toilet')).map(h => (
                  <HotspotPin key={h.id} hotspot={h} is3D={is3D} />
                ))}
                {activeLayers.has('medical') && HOTSPOTS.filter(h => h.level === 1 && h.type === 'medical').map(h => (
                  <HotspotPin key={h.id} hotspot={h} is3D={is3D} />
                ))}
                {activeLayers.has('security') && HOTSPOTS.filter(h => h.level === 1 && h.type === 'security').map(h => (
                  <HotspotPin key={h.id} hotspot={h} is3D={is3D} />
                ))}
                {activeLayers.has('staff') && HOTSPOTS.filter(h => h.level === 1 && h.type === 'volunteer').map(h => (
                  <HotspotPin key={h.id} hotspot={h} is3D={is3D} />
                ))}
              </motion.div>

            </motion.div>

            {/* Floating Data Panel */}
            <AnimatePresence>
              {selectedZone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  className="absolute right-6 top-6 w-80 glass glow-border-gold rounded-2xl p-5 z-50 shadow-2xl backdrop-blur-xl bg-black/60"
                  role="dialog"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-foreground text-lg">{selectedZone.label}</h2>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase">{selectedZone.type} — Level {selectedZone.level}</p>
                    </div>
                    <button
                      onClick={() => setSelectedZone(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="glass rounded-xl p-3 text-center border border-border/30">
                      <div className="text-xl font-bold font-mono text-gold">{selectedZone.current.toLocaleString()}</div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-0.5">Current Occupancy</div>
                    </div>
                    <div className="glass rounded-xl p-3 text-center border border-border/30">
                      <div className={cn("text-xl font-bold font-mono", STATUS_TEXT[selectedZone.status])}>
                        {selectedZone.capacity > 0 ? `${Math.round((selectedZone.current / selectedZone.capacity) * 100)}%` : 'N/A'}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-0.5">Fill Rate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                      STATUS_COLOR[selectedZone.status], STATUS_TEXT[selectedZone.status]
                    )}>
                      {selectedZone.status === 'ok' ? 'Flow Normal' : selectedZone.status === 'warn' ? 'High Congestion' : 'Critical Bottleneck'}
                    </span>
                    {selectedZone.status !== 'ok' && (
                      <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] font-bold uppercase hover:bg-gold/30 transition-colors ml-auto">
                        <AlertTriangle className="w-3 h-3" />
                        Deploy Team
                      </button>
                    )}
                  </div>
                  
                  {predictionTime > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <div className="flex items-center gap-1.5 mb-2 text-gold">
                        <Brain className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono font-bold uppercase">AI Forecast (+${predictionTime}m)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {selectedZone.status === 'critical' ? 'Model predicts congestion will persist. Recommended diversion protocols active.' : 
                         selectedZone.status === 'warn' ? 'Inflow rate increasing. Pre-emptive staff deployment advised.' :
                         'Capacity remains within nominal limits based on ticket scan rates.'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right panel: Alerts list */}
          <aside className="hidden xl:flex flex-col w-72 border-l border-border/30 p-4 gap-2 bg-background/60 overflow-y-auto z-20" aria-label="Zone status list">
            <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest mb-1">Live Telemetry</p>
            {currentZones.filter(z => z.type === 'section' || z.type === 'gate').sort((a,b) => b.current/b.capacity - a.current/a.capacity).slice(0,6).map(zone => {
              const ratio = zone.capacity > 0 ? zone.current / zone.capacity : 0
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(z => z?.id === zone.id ? null : zone)}
                  className={cn(
                    'glass rounded-xl p-3 text-left border transition-all hover:scale-[1.02]',
                    selectedZone?.id === zone.id ? 'border-gold/40 shadow-[0_0_15px_rgba(202,171,94,0.2)]' : 'border-border/30'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">{zone.label}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${STATUS_COLOR[zone.status]} ${STATUS_TEXT[zone.status]}`}>
                      {zone.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        zone.status === 'critical' ? 'bg-destructive' :
                        zone.status === 'warn' ? 'bg-amber-400' : 'bg-emerald'
                      )}
                      style={{ width: `${Math.round(ratio * 100)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 font-mono text-[10px] text-muted-foreground">
                    <span>{zone.current.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                    <span>{Math.round(ratio * 100)}%</span>
                  </div>
                </button>
              )
            })}

            {/* Alert indicators */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-3">AI Incident Predictions</p>
              {[
                { label: 'West Stand exit bottleneck imminent (+12m)', severity: 'critical' },
                { label: 'Food Zone F3 inventory low based on demand', severity: 'warn' },
                { label: 'Medical Team 4 dispatched to Gate B', severity: 'info' },
              ].map(({ label, severity }, i) => (
                <div key={i} className={cn(
                  'flex items-start gap-2 p-3 rounded-xl border mb-2 text-xs',
                  severity === 'critical'
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : severity === 'warn' ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                    : 'bg-blue-accent/10 border-blue-accent/30 text-blue-accent'
                )}>
                  {severity === 'info' ? <Activity className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                  <span className="leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function HotspotPin({ hotspot, is3D }: { hotspot: Hotspot, is3D: boolean }) {
  const Icon = HOTSPOT_ICONS[hotspot.type] ?? Navigation
  const colorMap: Record<string, string> = {
    food: 'bg-emerald border-emerald/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    medical: 'bg-destructive border-destructive/50 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    security: 'bg-blue-accent border-blue-accent/50 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    toilet: 'bg-muted border-white/20 text-muted-foreground',
    exit: 'bg-gold border-gold/50 text-black shadow-[0_0_15px_rgba(202,171,94,0.5)]',
    parking: 'bg-secondary border-white/20 text-foreground',
    volunteer: 'bg-amber-400 border-amber-400/50 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]',
  }
  return (
    <motion.div
      className="absolute z-50 pointer-events-auto"
      style={{ 
        left: `${hotspot.x}%`, 
        top: `${hotspot.y}%`, 
        transform: `translate(-50%, -50%)`
      }}
      initial={{ scale: 0, y: 0 }}
      animate={{ 
        scale: 1, 
        y: is3D ? -30 : 0 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      title={hotspot.label}
    >
      <div 
        className={cn('w-7 h-7 rounded-full flex items-center justify-center border-2', colorMap[hotspot.type])}
        style={{ transform: is3D ? 'rotateZ(45deg) rotateX(-60deg)' : 'none', transition: 'transform 0.3s ease' }}
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      
      {/* 3D Connecting Line / Stand */}
      {is3D && (
        <div className="absolute top-full left-1/2 w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent -translate-x-1/2 -mt-1 origin-top" 
             style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }} />
      )}

      {hotspot.alert && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
      )}
    </motion.div>
  )
}

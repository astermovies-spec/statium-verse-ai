'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cloud, Database, Shield, Cpu, Globe2, Zap, Bot, Map } from 'lucide-react'

const LAYERS = [
  {
    label: 'AI & Machine Learning',
    color: 'gold',
    items: ['Gemini Pro / Ultra', 'Vertex AI Agent Builder', 'Vertex AI Predictions', 'Cloud Vision AI', 'Speech-to-Text', 'Translation API'],
    icon: Bot,
  },
  {
    label: 'Data & Analytics',
    color: 'emerald',
    items: ['BigQuery', 'Firestore', 'Cloud Storage', 'Pub/Sub Streaming', 'Dataflow', 'Looker'],
    icon: Database,
  },
  {
    label: 'Infrastructure',
    color: 'blue',
    items: ['Cloud Run', 'Cloud Functions', 'GKE Autopilot', 'Cloud CDN', 'Load Balancing', 'Cloud Armor'],
    icon: Cloud,
  },
  {
    label: 'Security & Identity',
    color: 'red',
    items: ['Firebase Auth', 'Cloud IAM', 'Secret Manager', 'VPC Service Controls', 'Cloud KMS', 'Chronicle SIEM'],
    icon: Shield,
  },
]

const GC_SERVICES = [
  { name: 'Vertex AI', tag: 'ML Platform' },
  { name: 'Gemini API', tag: 'Foundation Model' },
  { name: 'BigQuery', tag: 'Analytics' },
  { name: 'Firebase', tag: 'Auth + DB' },
  { name: 'Cloud Run', tag: 'Serverless' },
  { name: 'Maps Platform', tag: 'Navigation' },
  { name: 'Pub/Sub', tag: 'Streaming' },
  { name: 'Cloud Armor', tag: 'WAF' },
]

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  gold:    { text: 'text-gold',        bg: 'bg-gold/10',        border: 'border-gold/30' },
  emerald: { text: 'text-emerald',     bg: 'bg-emerald/10',     border: 'border-emerald/30' },
  blue:    { text: 'text-blue-accent', bg: 'bg-blue-accent/10', border: 'border-blue-accent/30' },
  red:     { text: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
}

export function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 relative" aria-label="Technical Architecture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-blue-accent tracking-widest uppercase mb-3 block">Technical Architecture</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance mb-4">
            Powered by<br />
            <span className="gold-text">Google Cloud</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Enterprise-grade architecture built on Google Cloud with 99.97% uptime SLA, 
            zero-trust security, and global edge deployment.
          </p>
        </motion.div>

        {/* Architecture layers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {LAYERS.map(({ label, color, items, icon: Icon }, i) => {
            const c = colorMap[color]
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className={`glass border ${c.border} rounded-2xl p-5 flex flex-col gap-3`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${c.text}`} aria-hidden="true" />
                  </div>
                  <span className={`text-sm font-semibold ${c.text}`}>{label}</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`w-1 h-1 rounded-full ${c.bg.replace('/10', '')} flex-shrink-0`} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* GC services ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="glass glow-border-gold rounded-2xl p-6"
        >
          <p className="text-xs font-mono text-gold tracking-widest uppercase mb-4 text-center">Google Cloud Services</p>
          <div className="flex flex-wrap justify-center gap-3">
            {GC_SERVICES.map(({ name, tag }) => (
              <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="text-xs text-gold font-mono">{tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

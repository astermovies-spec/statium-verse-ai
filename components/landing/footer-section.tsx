'use client'

import Link from 'next/link'
import { Code2, Globe2, Zap } from 'lucide-react'

const LINKS = {
  Platform: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'AI Assistant', href: '/ai-assistant' },
    { label: 'Live Map', href: '/map' },
    { label: 'Analytics', href: '/analytics' },
  ],
  Operations: [
    { label: 'Security', href: '/security' },
    { label: 'Medical', href: '/medical' },
    { label: 'Volunteers', href: '/volunteers' },
    { label: 'Analytics', href: '/analytics' },
  ],
  Technology: [
    { label: 'Google Cloud', href: '#' },
    { label: 'Vertex AI', href: '#' },
    { label: 'Gemini API', href: '#' },
    { label: 'BigQuery', href: '#' },
  ],
}

export function FooterSection() {
  return (
    <footer className="border-t border-border/30 py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" aria-hidden="true" />
              </div>
              <span className="font-bold gold-text">StadiumVerse AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              The world&apos;s most advanced Smart Stadium and Tournament Operations Platform.
              Built for FIFA World Cup 2026.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-gold transition-colors" aria-label="Source code">
                <Code2 className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-gold transition-colors" aria-label="Website">
                <Globe2 className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-mono text-gold tracking-widest uppercase mb-4">{group}</h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            &copy; 2026 StadiumVerse AI. Built for Google Cloud Gen AI Hackathon 2026.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            <a href="#" className="hover:text-muted-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-muted-foreground transition-colors">Terms of Service</a>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

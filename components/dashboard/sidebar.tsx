'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard, Map, BarChart3, Bot, Shield, Heart, Users,
  ShoppingBag, Zap, Settings, Activity, Bell, FileText, Navigation, UserCircle, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { role, user, logout } = useAuth()

  const NAV_GROUPS = [
    {
      label: 'Command',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'organizer', 'security', 'medical'] },
        { href: '/map', label: 'Live Map', icon: Map, roles: ['all'] },
        { href: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'organizer'] },
        { href: '/ai-assistant', label: 'AI Assistant', icon: Bot, roles: ['all'] },
      ],
    },
    {
      label: 'Operations',
      items: [
        { href: '/security', label: 'Security', icon: Shield, roles: ['admin', 'security'] },
        { href: '/medical', label: 'Medical', icon: Heart, roles: ['admin', 'medical'] },
        { href: '/volunteers', label: 'Volunteers', icon: Users, roles: ['admin', 'organizer'] },
        { href: '/analytics', label: 'Vendors', icon: ShoppingBag, roles: ['admin', 'vendor', 'organizer'] },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { href: '/analytics', label: 'Reports', icon: FileText, roles: ['admin', 'organizer'] },
        { href: '/security', label: 'Alerts', icon: Bell, roles: ['admin', 'security', 'medical'] },
        { href: '/map', label: 'Navigation', icon: Navigation, roles: ['all'] },
      ],
    },
  ]

  const filteredGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes('all') || item.roles.includes(role))
  })).filter(group => group.items.length > 0)

  return (
    <aside
      className="hidden lg:flex flex-col w-60 min-h-screen bg-sidebar border-r border-sidebar-border sticky top-0"
      aria-label="Sidebar navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-sidebar-border h-16">
        <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 gold-glow">
          <Zap className="w-4 h-4 text-black" aria-hidden="true" />
        </div>
        <div>
          <span className="text-sm font-bold gold-text">StadiumVerse</span>
          <span className="text-xs text-muted-foreground block -mt-0.5 font-mono">AI · FIFA 2026</span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald/10 border border-emerald/20">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald">System Live</span>
          </div>
          <span className="flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald" />
          </span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Dashboard navigation">
        {filteredGroups.map(({ label, items }) => (
          <div key={label} className="mb-5">
            <p className="text-xs font-mono text-muted-foreground/50 tracking-widest uppercase px-3 mb-2">{label}</p>
            <ul className="flex flex-col gap-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon }) => {
                const active = pathname === href
                return (
                  <li key={itemLabel}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-gold/15 text-gold glow-border-gold'
                          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      {itemLabel}
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-gold"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl glass border border-border/30 group relative">
          <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
            {user?.displayName ? user.displayName.charAt(0) : role.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-foreground truncate">{user?.displayName || 'Demo User'}</div>
            <div className="text-[10px] text-muted-foreground truncate uppercase font-bold">{role}</div>
          </div>
          <button onClick={logout} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Log out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

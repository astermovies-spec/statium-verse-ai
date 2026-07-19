'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  LayoutDashboard,
  Map,
  BarChart3,
  Bot,
  Shield,
  Bell,
  LogOut,
  UserCircle as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { href: '/', label: 'Home', icon: Zap },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map', label: 'Live Map', icon: Map },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/security', label: 'Security', icon: Shield },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications] = useState(3)
  const [mounted, setMounted] = useState(false)
  const theme = "dark"; const setTheme = (t: string) => {}
  const pathname = usePathname()
  const { user, role, logout, isSimulated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass border-b border-gold/20 shadow-lg shadow-black/20'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="StadiumVerse AI Home">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-lg gold-glow">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                  <path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" fill="white" opacity="0.9" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald rounded-full border-2 border-background animate-pulse" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold gold-text tracking-wide">StadiumVerse</span>
              <span className="text-xs text-muted-foreground block -mt-1 font-mono">AI · FIFA 2026</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  pathname === href
                    ? 'bg-gold/15 text-gold glow-border-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                aria-current={pathname === href ? 'page' : undefined}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              className="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-gold transition-colors border border-transparent hover:border-gold/30"
              aria-label={`${notifications} notifications`}
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {notifications > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {notifications}
                </span>
              )}
            </button>

            {/* Theme toggle — only render after mount to avoid SSR/client mismatch */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-gold transition-colors border border-transparent hover:border-gold/30"
              aria-label={mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme'}
              suppressHydrationWarning
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Auth / Profile */}
            {mounted && (user || isSimulated) ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-border/30">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-gold" />
                  )}
                </div>
                <div className="flex flex-col mr-2">
                  <span className="text-[10px] uppercase font-bold text-foreground leading-none">{role}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1 rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl gold-gradient text-black text-sm font-semibold shadow-lg gold-glow hover:scale-105 transition-transform"
              >
                <span>Dashboard</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-border overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === href
                      ? 'bg-gold/15 text-gold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      
    </motion.header>
  )
}

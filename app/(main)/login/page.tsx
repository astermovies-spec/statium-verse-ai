'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Shield, Zap, Lock, Mail, ChevronRight, UserCircle } from 'lucide-react'
import { StadiumBackground } from '@/components/stadium-background'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { signInWithGoogle, setSimulatedRole, user, role } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRoles, setShowRoles] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleLogin = (selectedRole: any) => {
    setIsLoading(true)
    setSimulatedRole(selectedRole)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <StadiumBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative z-10 w-full max-w-md glass glow-border-gold rounded-3xl p-8 overflow-hidden"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg shadow-gold/20 mb-6 relative group">
            <Shield className="w-8 h-8 text-black" aria-hidden="true" />
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse pointer-events-none" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Secure Portal Access</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to the StadiumVerse Operations Center
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showRoles ? (
            <motion.div
              key="auth-methods"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl glass border border-border/50 text-foreground hover:bg-muted/10 transition-colors disabled:opacity-50 group"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald/0 via-emerald/10 to-emerald/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-semibold">Sign in with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30" />
                </div>
                <div className="relative bg-background/50 px-2 text-xs text-muted-foreground uppercase tracking-wider backdrop-blur-sm">
                  Or
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="name@fifa.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 bg-transparent"
                />
              </div>

              <button
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gold-gradient text-black font-bold shadow-lg shadow-gold/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    Sign In with Email
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRoles(true)}
                className="mt-2 text-sm text-muted-foreground hover:text-gold transition-colors flex items-center justify-center gap-1"
              >
                Developer: Try Demo Roles
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="demo-roles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-foreground mb-2 text-center">Select Demo Profile</h3>
              {[
                { id: 'admin', label: 'Global Administrator', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { id: 'organizer', label: 'Tournament Organizer', icon: Zap, color: 'text-gold', bg: 'bg-gold/10' },
                { id: 'security', label: 'Security Chief', icon: Lock, color: 'text-blue-accent', bg: 'bg-blue-accent/10' },
                { id: 'fan', label: 'VIP Fan', icon: UserCircle, color: 'text-emerald', bg: 'bg-emerald/10' },
              ].map(({ id, label, icon: Icon, color, bg }) => (
                <button
                  key={id}
                  onClick={() => handleRoleLogin(id as any)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl glass border border-border/30 hover:border-gold/50 transition-colors text-left group"
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
                    <Icon className={cn('w-4 h-4', color)} />
                  </div>
                  <span className="font-medium text-sm flex-1">{label}</span>
                  {isLoading && <span className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />}
                </button>
              ))}
              <button
                onClick={() => setShowRoles(false)}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground text-center"
              >
                Back to Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

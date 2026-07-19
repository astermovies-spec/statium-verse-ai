'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getFirebaseAuth } from './firebase'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth'

type Role = 'fan' | 'organizer' | 'security' | 'medical' | 'volunteer' | 'vendor' | 'admin'

interface AuthContextType {
  user: User | null
  role: Role
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setSimulatedRole: (role: Role) => void
  isSimulated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'fan',
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  setSimulatedRole: () => {},
  isSimulated: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>('fan')
  const [loading, setLoading] = useState(true)
  const [isSimulated, setIsSimulated] = useState(false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      // Fallback to simulated auth if Firebase is not configured
      setIsSimulated(true)
      const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('simulated_role') as Role : null) || 'fan'
      setRole(storedRole)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Here we would typically fetch the role from Firestore
        // For hackathon demo, we default to organizer if it's a specific email, else fan
        if (currentUser.email?.includes('admin')) setRole('admin')
        else if (currentUser.email?.includes('security')) setRole('security')
        else setRole('fan')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      // Simulated sign in
      setIsSimulated(true)
      setRole('organizer')
      if (typeof window !== 'undefined') localStorage.setItem('simulated_role', 'organizer')
      return
    }
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setRole('fan')
      if (typeof window !== 'undefined') localStorage.removeItem('simulated_role')
      return
    }
    await signOut(auth)
  }

  const setSimulatedRole = (newRole: Role) => {
    setRole(newRole)
    if (typeof window !== 'undefined') localStorage.setItem('simulated_role', newRole)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, logout, setSimulatedRole, isSimulated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

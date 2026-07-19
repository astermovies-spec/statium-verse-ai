'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import { AuthProvider as OriginalAuthProvider } from '@/lib/auth-context'

export const ClientThemeProvider = dynamic(
  () => import('@/components/theme-provider').then((m) => m.ThemeProvider),
  { ssr: false }
)

export const ClientLiveScoreTicker = dynamic(
  () => import('@/components/live-score-ticker').then((m) => m.LiveScoreTicker),
  { ssr: false }
)

// AuthProvider needs to wrap children, so we can't easily dynamic() it without losing SSR for children.
// BUT we can wrap it if we are okay with no SSR for the entire app? NO, we want SSR for the app.
// Wait! dynamic() with ssr: false on a provider will disable SSR for all its children!

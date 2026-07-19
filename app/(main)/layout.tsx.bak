import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { LiveScoreTicker } from '@/components/live-score-ticker'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <AuthProvider>
        <LiveScoreTicker />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}

import { KPICards } from '@/components/dashboard/kpi-cards'
import { LiveFeed } from '@/components/dashboard/live-feed'
import { MatchWidget } from '@/components/dashboard/match-widget'
import { LiveCharts } from '@/components/dashboard/live-charts-wrapper'

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            FIFA World Cup 2026 · Match Day 14 · All systems operational
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald/15 border border-emerald/30 text-xs font-semibold text-emerald flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            Live
          </div>
          <div className="px-3 py-1.5 rounded-xl glass border border-gold/20 text-xs font-mono text-gold">
            16 venues online
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Match + Weather */}
      <MatchWidget />

      {/* Charts */}
      <LiveCharts />

      {/* Live Feed */}
      <LiveFeed />
    </div>
  )
}

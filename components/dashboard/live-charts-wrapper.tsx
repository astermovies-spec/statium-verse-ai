'use client'

import dynamic from 'next/dynamic'

export const LiveCharts = dynamic(() => import('@/components/dashboard/live-charts').then(m => m.LiveCharts), { ssr: false })

'use client'
import dynamic from 'next/dynamic'
export const AnalyticsContent = dynamic(() => import('@/components/analytics-content').then(m => m.default), { ssr: false })

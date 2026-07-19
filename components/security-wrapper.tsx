'use client'
import dynamic from 'next/dynamic'
export const SecurityContent = dynamic(() => import('@/components/security-content').then(m => m.default), { ssr: false })

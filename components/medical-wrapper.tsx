'use client'
import dynamic from 'next/dynamic'
export const MedicalContent = dynamic(() => import('@/components/medical-content').then(m => m.default), { ssr: false })

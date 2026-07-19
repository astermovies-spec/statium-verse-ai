'use client'

import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { AIDemoSection } from '@/components/landing/ai-demo-section'
import { ArchitectureSection } from '@/components/landing/architecture-section'
import { SponsorsSection } from '@/components/landing/sponsors-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FooterSection } from '@/components/landing/footer-section'
import { Navbar } from '@/components/navbar'
import { StadiumBackground } from '@/components/stadium-background'

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-background">
      <StadiumBackground />
      <Navbar />
      <main className="flex-1 relative z-10" role="main">
        <HeroSection />
        <StatsSection />
        <AIDemoSection />
        <ArchitectureSection />
        <TestimonialsSection />
        <SponsorsSection />
      </main>
      <FooterSection />
    </div>
  )
}

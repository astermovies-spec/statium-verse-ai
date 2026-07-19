'use client'

import { useEffect, useRef } from 'react'

export function StadiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    const createParticles = () => {
      const count = Math.min(60, Math.floor((width * height) / 25000))
      particles.length = 0
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    createParticles()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      createParticles()
    }

    window.addEventListener('resize', handleResize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw particle lines/connections occasionally or just draw particles
      ctx.fillStyle = 'rgba(199, 160, 81, 0.25)' // Gold color with opacity

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > width) p.speedX *= -1
        if (p.y < 0 || p.y > height) p.speedY *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(199, 160, 81, ${p.opacity})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-background" id="stadium-bg-container">
      {/* Golden spotlight at top-center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% -10%, oklch(0.78 0.17 55 / 14%) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />
      
      {/* Emerald field glow at the bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 110%, oklch(0.55 0.18 155 / 10%) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />
      
      {/* Stadium Grid lines */}
      <div className="absolute inset-0 stadium-grid opacity-35" />
      
      {/* Animated Scan Line */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-scan" />
      
      {/* Fine floating particles */}
      <canvas ref={canvasRef} className="particle-canvas opacity-40" />
    </div>
  )
}

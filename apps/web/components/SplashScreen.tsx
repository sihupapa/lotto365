'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BALLS = [
  { number: 7,  color: '#FFD700', angle: 0 },
  { number: 13, color: '#FF6B6B', angle: 60 },
  { number: 22, color: '#4ECDC4', angle: 120 },
  { number: 31, color: '#45B7D1', angle: 180 },
  { number: 38, color: '#96CEB4', angle: 240 },
  { number: 45, color: '#DDA0DD', angle: 300 },
]

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 8 + 4,
  delay: Math.random() * 0.6,
  color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#DDA0DD', '#96CEB4'][i % 6],
}))

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [explode, setExplode] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) return

    setVisible(true)

    const t1 = setTimeout(() => setExplode(true), 350)
    const t2 = setTimeout(() => setExiting(true), 1600)
    const t3 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('splashShown', '1')
    }, 2100)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a0533 100%)' }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 낙하하는 색종이 파티클 */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -12,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: 900,
            opacity: [0, 1, 1, 0],
            rotate: 720,
          }}
          transition={{
            delay: p.delay + 0.3,
            duration: 1.6,
            ease: 'easeIn',
          }}
        />
      ))}

      {/* 중앙 영역 */}
      <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
        {/* 골드 빛 폭발 링 */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            background: 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, transparent 70%)',
          }}
          animate={explode ? { scale: [1, 3], opacity: [0.9, 0] } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />

        {/* 로또볼 폭발 */}
        {BALLS.map((ball, i) => {
          const rad = (ball.angle * Math.PI) / 180
          const dist = 132
          const x = Math.cos(rad) * dist
          const y = Math.sin(rad) * dist

          return (
            <motion.div
              key={i}
              className="absolute flex items-center justify-center rounded-full font-black text-white select-none"
              style={{
                width: 56,
                height: 56,
                fontSize: 19,
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, ${ball.color} 45%)`,
                boxShadow: `0 0 18px ${ball.color}99, 0 4px 12px rgba(0,0,0,0.4)`,
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={
                explode
                  ? { x, y, scale: [0, 1.4, 1], opacity: 1 }
                  : {}
              }
              transition={{
                delay: i * 0.055,
                type: 'spring',
                stiffness: 420,
                damping: 16,
              }}
            >
              {ball.number}
            </motion.div>
          )
        })}

        {/* 클로버 + LOTTO + 텍스트 */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
        >
          <motion.div
            className="text-[72px] leading-none select-none"
            animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
            transition={{ delay: 0.25, duration: 0.55, ease: 'easeInOut' }}
          >
            🍀
          </motion.div>

          <motion.p
            className="text-3xl font-black tracking-[0.35em] mt-2"
            style={{
              color: '#FFD700',
              textShadow: '0 0 24px rgba(255,215,0,0.7), 0 0 48px rgba(255,215,0,0.3)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            LOTTO
          </motion.p>

          <motion.p
            className="text-sm font-semibold mt-1.5 tracking-wide"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            행운이 터진다! ✨
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { motion, useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from 'framer-motion'

export default function ScrollSkew({ children }) {
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  // Map velocity to skewY: fast scroll = slight tilt, stationary = 0
  const skewVelocity = useTransform(scrollVelocity, [-1500, 1500], [4, -4])

  // Spring smoothing — snaps back gradually
  const skewY = useSpring(skewVelocity, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  })

  if (prefersReduced) return <>{children}</>

  return (
    <motion.div style={{ skewY }}>
      {children}
    </motion.div>
  )
}

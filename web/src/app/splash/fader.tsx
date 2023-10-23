'use client'

import cn from 'classnames'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform
} from 'framer-motion'

export const Fader = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0.3])
  const blur = useTransform(scrollYProgress, [0.1, 0.2], [0, 2])
  const filter = useMotionTemplate`blur(${blur}px)`

  return (
    <motion.div
      style={{ opacity, filter }}
      className={cn(className, 'lg:!opacity-100 lg:!blur-none')}
    >
      {children}
    </motion.div>
  )
}

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import cn from 'classnames'

export const Fader = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.1])

  return (
    <motion.div
      style={{ opacity }}
      className={cn(className, 'lg:!opacity-100')}
    >
      {children}
    </motion.div>
  )
}

'use client'

import cn from 'classnames'
import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

const childClass = 'mr-16 whitespace-nowrap flex gap-16'

export const Marquee: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <div
      className={cn('bg-black text-white overflow-x-hidden py-4', className)}
    >
      <motion.div
        animate={{ x: ['0%', `-${100 / 5}%`] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="text-20 flex w-max whitespace-nowrap"
      >
        <span className={childClass}>{children}</span>
        <span aria-hidden className={childClass}>
          {children}
        </span>
        <span aria-hidden className={childClass}>
          {children}
        </span>
        <span aria-hidden className={childClass}>
          {children}
        </span>
        <span aria-hidden className={childClass}>
          {children}
        </span>
      </motion.div>
    </div>
  )
}

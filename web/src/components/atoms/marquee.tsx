'use client'

import { motion } from 'framer-motion'
import { FC } from 'react'

const childClass = 'mr-20'

export const Marquee: FC<{ children: string }> = ({ children }) => {
  return (
    <div className="bg-khaki overflow-x-hidden border-y border-black py-6">
      <motion.div
        animate={{ x: ['0%', `-${100 / 3}%`] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="text-20 flex w-max whitespace-nowrap"
      >
        <span className={childClass}>{children}</span>
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

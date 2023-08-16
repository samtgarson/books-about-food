'use client'

import { motion } from 'framer-motion'
import { FC } from 'react'

const childClass = 'mr-20'

export const Marquee: FC<{ children: string }> = ({ children }) => {
  return (
    <div className="bg-khaki py-6 border-y border-black overflow-x-hidden">
      <motion.div
        animate={{ x: ['0%', `-${100 / 3}%`] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="whitespace-nowrap flex text-20 w-max"
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

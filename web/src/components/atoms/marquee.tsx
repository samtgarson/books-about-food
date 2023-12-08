'use client'

import cn from 'classnames'
import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'
import { useNav } from '../nav/context'

const childClass = 'mr-16 whitespace-nowrap flex gap-16'

export const Marquee: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className
}) => {
  const { footerVisible } = useNav()
  return (
    <div
      className={cn(
        'bg-black text-white overflow-x-hidden py-4 transition-opacity duration-300',
        className,
        footerVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
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

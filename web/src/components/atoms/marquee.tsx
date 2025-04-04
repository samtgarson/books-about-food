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
        'overflow-x-hidden bg-black py-4 text-white transition-opacity duration-300',
        className,
        footerVisible ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      <motion.div
        animate={{ x: ['0%', `-${100 / 5}%`] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex w-max whitespace-nowrap text-20"
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

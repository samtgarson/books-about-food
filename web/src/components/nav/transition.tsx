'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LogoShape } from '../icons/logo-shape'
import { LogoText } from '../icons/logo-text'

function findClosestAnchor(
  element: EventTarget | null
): HTMLAnchorElement | null {
  while (
    element &&
    element instanceof HTMLElement &&
    element.tagName.toLowerCase() !== 'a'
  ) {
    element = element.parentElement
  }
  return element as HTMLAnchorElement
}

export function Transition() {
  const [show, setShow] = useState(true)
  const pathname = usePathname()
  const timer = useRef<NodeJS.Timeout | null>(null)

  const handleClick = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    const anchor = findClosestAnchor(e.target)
    if (!anchor) return
    const targetHref = new URL(anchor.href).pathname
    if (targetHref === window.location.pathname) return

    timer.current = setTimeout(() => {
      setShow(true)
    }, 100)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }

    setShow(false)
  }, [pathname])

  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.1 } }}
          className="bg-grey fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
        >
          <div className="relative">
            <LogoShape
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            <LogoText
              className="absolute inset-x-0 top-1/2 mx-auto text-white"
              initial={{ y: '-40%' }}
              animate={{ y: '-50%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <motion.p
            aria-label="One moment please"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="all-caps"
          >
            {'One moment please'.split('').map((char, index) => (
              <motion.span
                key={index}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                  delay: 0.1 + index * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1.75
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

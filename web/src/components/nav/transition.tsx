'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { LogoShape } from '../icons/logo-shape'
import { LogoText } from '../icons/logo-text'
import { useSheet } from '../sheets/global-sheet'

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

export type TransitionControl = {
  show(): void
}

type TransitionProps = {
  setInternalLoading: (loading: boolean) => void
}

export const Transition = forwardRef<TransitionControl, TransitionProps>(
  function Transition({ setInternalLoading }, ref) {
    const [show, setShow] = useState(false)
    const pathname = usePathname()
    const timer = useRef<NodeJS.Timeout | null>(null)
    const { closeSheet } = useSheet()

    useImperativeHandle(ref, () => ({
      show: () => setShow(true)
    }))

    const handleClick = useCallback(
      (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        const anchor = findClosestAnchor(e.target)
        if (!anchor || anchor.target === '_blank') return
        if (anchor.href === window.location.href + '#') return
        try {
          const targetHref = new URL(anchor.href).pathname
          if (targetHref === window.location.pathname) {
            setInternalLoading(true)
            return
          }

          closeSheet()
          timer.current = setTimeout(() => {
            setShow(true)
          }, 100)
          // eslint-disable-next-line no-empty
        } catch {}
      },
      [closeSheet, setInternalLoading]
    )

    useEffect(() => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }

      setShow(false)
      setInternalLoading(false)
    }, [pathname, setInternalLoading])

    useEffect(() => {
      window.addEventListener('click', handleClick)
      return () => window.removeEventListener('click', handleClick)
    }, [handleClick])

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.1 } }}
            className="fixed inset-0 z-page-transition flex flex-col items-center justify-center bg-grey"
          >
            <div className="flex scale-75 flex-col items-center justify-center gap-8 sm:scale-100">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {' '}
                  <LogoShape />
                </motion.div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

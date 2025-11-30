'use client'

import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'src/components/atoms/icons'
import {
  MouseMode,
  MouseState,
  animateMouse,
  fadeProps,
  getMode
} from './utils'

export type { MouseMode }

const MotionChevronLeft = motion.create(ChevronLeft)
const MotionChevronRight = motion.create(ChevronRight)

export const Mouse = () => {
  const ref = useRef<HTMLDivElement>(null)
  const position = useRef({ x: 0, y: 0 })
  const [{ mode, text, theme = 'light' }, setState] = useState<MouseState>({
    mode: 'default'
  })

  useEffect(() => {
    const loop = () => {
      if (!ref.current) return
      requestAnimationFrame(loop)
      const target = position.current
      animateMouse(ref.current, target)

      const state = getMode(target)
      setState(state)
    }

    const onMouseMove = (event: MouseEvent) => {
      position.current = {
        x: event.clientX,
        y: event.clientY
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    loop()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  const differenceMode = mode === 'default' || mode === 'clickable'
  return (
    <div
      className={cn(
        'pointer-events-none fixed -top-2 -left-2 z-mouse-pointer will-change-transform',
        { 'mix-blend-difference': differenceMode }
      )}
      ref={ref}
    >
      <div
        className={cn(
          'hidden h-4 w-4 items-center justify-center rounded-full border transition duration-500 ease-out md:flex',
          {
            'transition-200 scale-x-0 opacity-0': mode === 'typeable',
            'scale-[5]': mode === 'next' || mode === 'prev',
            'scale-150 bg-transparent! duration-200!': mode === 'clickable',
            'border-white bg-white text-black':
              theme === 'dark' || differenceMode,
            'border-black bg-black text-white':
              theme === 'light' && !differenceMode
          }
        )}
      >
        {text && text}
        <AnimatePresence>
          {mode === 'prev' && (
            <MotionChevronLeft
              {...fadeProps}
              className={cn('h-2 w-2')}
              strokeWidth={1}
            />
          )}
          {mode === 'next' && (
            <MotionChevronRight
              {...fadeProps}
              className={cn('h-2 w-2')}
              strokeWidth={1}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const mouseAttrs = ({
  theme,
  mode,
  enabled = true
}: Partial<MouseState> & { enabled?: boolean }) => ({
  'data-mouse-theme': theme,
  'data-mouse-mode': enabled ? mode : undefined
})

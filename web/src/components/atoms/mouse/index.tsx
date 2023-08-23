'use client'

import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import {
  MouseMode,
  MouseState,
  animateMouse,
  fadeProps,
  getMode
} from './utils'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { AnimatePresence, motion } from 'framer-motion'

export type { MouseMode }

const MotionChevronLeft = motion(ChevronLeft)
const MotionChevronRight = motion(ChevronRight)

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
        'fixed -top-2 -left-2 z-50 pointer-events-none will-change-transform',
        { 'mix-blend-difference': differenceMode }
      )}
      ref={ref}
    >
      <div
        className={cn(
          'w-4 h-4 rounded-full border transition duration-500 ease-out items-center justify-center hidden md:flex',
          {
            'opacity-0 scale-x-0 transition-200': mode === 'typeable',
            'scale-[5]': mode === 'next' || mode === 'prev',
            'scale-150 !bg-transparent !duration-200': mode === 'clickable',
            'bg-white border-white text-black':
              theme === 'dark' || differenceMode,
            'bg-black border-black text-white':
              theme === 'light' && !differenceMode
          }
        )}
      >
        {text && text}
        <AnimatePresence>
          {mode === 'prev' && (
            <MotionChevronLeft
              {...fadeProps}
              className={cn('w-2 h-2')}
              strokeWidth={1}
            />
          )}
          {mode === 'next' && (
            <MotionChevronRight
              {...fadeProps}
              className={cn('w-2 h-2')}
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

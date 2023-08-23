import { MotionProps } from 'framer-motion'
import { NavTheme } from 'src/components/nav/context'

export type MouseMode = 'default' | 'next' | 'prev' | 'clickable' | 'typeable'
export type Point = { x: number; y: number }
export type MouseState = {
  mode: MouseMode
  text?: string
  theme?: NavTheme
}

const easing = 0.1

export const animateMouse = (ref: HTMLDivElement, target: Point) => {
  const transform = new WebKitCSSMatrix(ref.style.transform)
  const currentX = transform.m41
  const currentY = transform.m42
  // use currrent position and previous position to ease the movement
  const dx = target.x - currentX
  const dy = target.y - currentY
  const newX = currentX + dx * easing
  const newY = currentY + dy * easing
  ref.style.transform = `translate(${newX}px, ${newY}px)`
}

export const getMode = ({ x, y }: Point): MouseState => {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return { mode: 'default' }

  if (el.dataset.mouseMode)
    return {
      mode: el.dataset.mouseMode as MouseMode,
      theme: el.dataset.mouseTheme as NavTheme
    }
  const anchor =
    el.tagName === 'A' || el.tagName === 'BUTTON' || el.role === 'menuitem'
  if (anchor && !(el as HTMLButtonElement).disabled)
    return { mode: 'clickable' }

  const typeable = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
  if (typeable && !(el as HTMLInputElement).disabled)
    return { mode: 'typeable' }

  return { mode: 'default' }
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const fadeProps = {
  variants: fadeVariants,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
} satisfies MotionProps

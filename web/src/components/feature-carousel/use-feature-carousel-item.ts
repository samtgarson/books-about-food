'use client'
import cn from 'classnames'
import { MotionProps } from 'framer-motion'
import { CSSProperties } from 'react'
import { MouseState } from '../atoms/mouse/utils'

export type CarouselPosition = ReturnType<
  typeof useFeatureCarouselItem
>['position']

export function useFeatureCarouselItem({
  index,
  currentIndex,
  centered = true,
  preTitle = false,
  postTitle = false,
  imageWidth = 260,
  title = false
}: {
  index: number
  currentIndex: number
  centered?: boolean
  preTitle?: boolean
  postTitle?: boolean
  imageWidth?: number
  title?: boolean
}) {
  const pos = {
    prev: index === currentIndex - 1,
    current: index === currentIndex,
    next: index === currentIndex + 1,
    offNext: index === currentIndex + 2,
    offPrev: index === currentIndex - 2
  }

  const className = cn(
    'flex items-start lg:items-center justify-center gap-8 lg:gap-16 flex-col lg:flex-row pt-[35px] sm:pt-0 w-full h-full absolute',
    {
      'z-10': pos.current,
      'left-auto right-full lg:right-auto lg:-left-[calc(var(--imageWidth)-80px)]':
        pos.prev,
      'left-full sm:left-[calc(100%-80px)]': pos.next,
      'z-20': pos.next,
      'left-5 md:left-16 lg:left-44': pos.current && !title,
      'left-5 md:left-16': pos.current && title,
      'pr-10 md:pr-32 lg:pr-80': !title,
      'pr-10 md:pr-32': title,
      'right-full': pos.offPrev,
      'left-full': pos.offNext,
      'pointer-events-none': pos.offNext || pos.offPrev,
      'lg:justify-center': centered
    }
  )

  const hidden = pos.offNext || pos.offPrev || (pos.prev && preTitle)
  const attrs = {
    transition: { ease: 'easeInOut', duration: 0.4 },
    style: { '--imageWidth': `${imageWidth}px` } as CSSProperties,
    animate: {
      opacity: hidden ? 0 : 1
    },
    whileHover: pos.next ? { x: -20 } : pos.prev ? { x: 20 } : {},
    initial: false
  } satisfies MotionProps

  const display =
    pos.prev || pos.current || pos.next || pos.offNext || pos.offPrev

  const mouseProps: MouseState = {
    mode: pos.next ? 'next' : pos.prev ? 'prev' : 'clickable',
    theme: (postTitle && pos.next) || (preTitle && pos.prev) ? 'dark' : 'light'
  }

  return {
    current: pos.current,
    attrs,
    display,
    className,
    next: pos.next,
    prev: pos.prev,
    mouseProps,
    position: Object.keys(pos).find(
      (key) => pos[key as keyof typeof pos]
    ) as keyof typeof pos
  }
}

'use client'
import cn from 'classnames'
import { MotionProps } from 'framer-motion'
import { CSSProperties } from 'react'
import { MouseState } from '../atoms/mouse/utils'

export function useFeatureCarouselItem({
  index,
  currentIndex,
  centered = true,
  preTitle = false,
  postTitle = false,
  imageWidth = 260
}: {
  index: number
  currentIndex: number
  centered?: boolean
  preTitle?: boolean
  postTitle?: boolean
  imageWidth?: number
}) {
  const pos = {
    prev: index === currentIndex - 1,
    current: index === currentIndex,
    next: index === currentIndex + 1,
    offNext: index === currentIndex + 2,
    offPrev: index === currentIndex - 2
  }

  const className = cn(
    'flex items-start lg:items-center justify-center gap-8 lg:gap-20 flex-col lg:flex-row h-screen pt-[35px] sm:pt-0 sm:h-[770px] lg:h-[800px] top-0 w-[calc(100vw-40px)] sm:w-[calc(85vw-10rem)]',
    {
      [`relative flex-grow z-10`]: pos.current,
      'absolute right-full lg:right-auto lg:ml-[7vw] lg:left-[var(--imageWidth)]':
        pos.prev,
      'absolute left-full lg:-ml-[10.5rem] lg:pl-[7rem] sm:-ml-24': pos.next,
      'absolute right-full': pos.offPrev,
      'absolute left-full': pos.offNext,
      'lg:justify-center': centered
    }
  )

  const hidden = pos.offNext || pos.offPrev || (pos.prev && preTitle)
  const attrs = {
    transition: { ease: 'easeInOut', duration: 0.4 },
    style: { '--imageWidth': `${-imageWidth}px` } as CSSProperties,
    animate: {
      opacity: hidden ? 0 : 1,
      z: pos.current ? '10px' : '0px'
    },
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
    mouseProps
  }
}

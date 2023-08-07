'use client'
import cn from 'classnames'
import { MotionProps } from 'framer-motion'

export function useFeatureCarouselItem({
  index,
  currentIndex,
  centered = true,
  preTitle = false
}: {
  index: number
  currentIndex: number
  centered?: boolean
  preTitle?: boolean
}) {
  const pos = {
    prev: index === currentIndex - 1,
    current: index === currentIndex,
    next: index === currentIndex + 1,
    offNext: index === currentIndex + 2,
    offPrev: index === currentIndex - 2
  }

  const className = cn(
    'flex items-start lg:items-center gap-8 lg:gap-20 flex-col lg:flex-row h-[550px] lg:h-96 top-0 w-[calc(85vw-10rem)]',
    {
      [`relative flex-grow z-10`]: pos.current,
      'pointer-events-none': !pos.current,
      'absolute right-full lg:right-auto lg:ml-[7vw] lg:left-[-260px]':
        pos.prev,
      'absolute left-full lg:-ml-[3.5rem] sm:-ml-24': pos.next,
      'absolute right-full': pos.offPrev,
      'absolute left-full': pos.offNext,
      'lg:justify-center': centered
    }
  )

  const hidden = pos.offNext || pos.offPrev || (pos.prev && preTitle)
  const attrs = {
    transition: { ease: 'easeInOut', duration: 0.4 },
    animate: {
      opacity: hidden ? 0 : 1,
      z: pos.current ? '10px' : '0px'
    },
    initial: false
  } satisfies MotionProps

  const display =
    pos.prev || pos.current || pos.next || pos.offNext || pos.offPrev

  return { current: pos.current, attrs, display, className }
}

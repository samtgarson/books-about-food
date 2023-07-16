'use client'
import cn from 'classnames'
import { containerClasses } from '../atoms/container'

export function useFeatureCarouselItem({
  index,
  currentIndex,
  centered = true
}: {
  index: number
  currentIndex: number
  centered?: boolean
}) {
  const pos = {
    prev: index === currentIndex - 1,
    current: index === currentIndex,
    next: index === currentIndex + 1,
    offNext: index === currentIndex + 2
    // offPrev: index === currentIndex - 2
  }

  const classes = cn(
    'flex items-start lg:items-center gap-8 lg:gap-20 flex-col lg:flex-row h-full w-full max-w-4xl top-0',
    {
      [`flex-grow ${containerClasses()}`]: pos.current,
      'absolute right-full': pos.prev,
      // 'absolute right-full -mr-4': pos.offPrev,
      'absolute left-full -ml-[3.5rem] sm:-ml-24': pos.next,
      'absolute left-full': pos.offNext,
      'lg:justify-center': centered
    }
  )

  const attrs = {
    transition: { ease: 'easeInOut', duration: 0.4 },
    className: classes,
    animate: {
      opacity: pos.offNext ? 0 : 1
    }
  }

  const display = pos.prev || pos.current || pos.next || pos.offNext

  return { current: pos.current, attrs, display }
}

'use client'

import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'src/components/atoms/icons'
import { useNav } from '../nav/context'
import { Faces } from './faces'
import { FeatureCarouselFeature, FeatureCarouselItem } from './item'
import { FeatureCarouselTitleProps, Title } from './title'

export type FeatureCarouselProps = {
  features: FeatureCarouselFeature[]
  title?: boolean | ((props: FeatureCarouselTitleProps) => ReactNode)
  faces?: boolean
  className?: string
}

type Item =
  | { feature: FeatureCarouselFeature; isTitle?: never }
  | { feature?: never; isTitle: true }

const createLoop = (
  features: FeatureCarouselFeature[],
  showTitle: boolean
): Item[] => {
  const featureItems = features.map((feature) => ({ feature }))
  const title = { isTitle: true } as const

  const batch = showTitle ? [title, ...featureItems] : featureItems
  while (batch.length < 3) {
    batch.push(...batch)
  }
  return [...batch, ...batch, ...batch]
}

export function FeatureCarousel({
  features,
  title = false,
  faces: showFaces = false,
  className
}: FeatureCarouselProps) {
  const showTitle = !!title
  const [[currentIndex, offset], setState] = useState([
    features.length + (showTitle ? 1 : 0),
    0
  ])
  const loop = createLoop(features, showTitle)
  const totalSlides = useMemo(
    () => features.length + (showTitle ? 1 : 0),
    [showTitle, features.length]
  )
  const showingTitle = useMemo(
    () => showTitle && currentIndex % totalSlides === 0,
    [showTitle, currentIndex, totalSlides]
  )
  const { theme } = useNav()
  const activeIndex = currentIndex - (offset + 1) * totalSlides
  const mouseRef = useRef<[number, number][] | null>(null)

  const onClick = (virtualIndex: number) => {
    const rangeStart = (offset + 1) * totalSlides
    const rangeEnd = rangeStart + totalSlides - 1
    const newOffset =
      virtualIndex < rangeStart
        ? offset - 1
        : virtualIndex > rangeEnd
        ? offset + 1
        : offset

    setState([virtualIndex, newOffset])
  }

  const onSwipe = () => {
    if (!mouseRef.current) return
    if (mouseRef.current.length < 2) return requestAnimationFrame(onSwipe)

    const [[origX, origY], [recentX, recentY]] = mouseRef.current
    if (Math.abs(origY - recentY) > 10) return (mouseRef.current = null)

    const x = origX - recentX
    if (Math.abs(x) < 50) return requestAnimationFrame(onSwipe)

    if (x > 50) onClick(currentIndex + 1)
    if (x < -50) onClick(currentIndex - 1)
    mouseRef.current = null
  }

  if (!features.length) return null
  const color = theme === 'dark' ? 'white' : 'black'

  return (
    <motion.div
      layout
      onTouchStart={(e) => {
        mouseRef.current = [[e.touches[0].clientX, e.touches[0].clientY]]
        requestAnimationFrame(onSwipe)
      }}
      onTouchMove={(e) => {
        if (!mouseRef.current) return
        mouseRef.current = [
          mouseRef.current[0],
          [e.touches[0].clientX, e.touches[0].clientY]
        ]
      }}
      onTouchEnd={() => {
        mouseRef.current = null
      }}
      className={cn(
        'relative overflow-x-clip transition-colors w-full',
        className,
        theme === 'dark' ? 'bg-black' : 'bg-transparent'
      )}
    >
      <AnimatePresence>
        {showFaces && showingTitle && (
          <Faces books={features.map((f) => f.book)} />
        )}
      </AnimatePresence>
      <div className={cn('absolute inset-x-0 bottom-16 sm:bottom-0 top-16')}>
        {loop.map(({ isTitle, feature }, index) => {
          const virtualIndex = offset * totalSlides + index
          const batch = Math.floor(index / totalSlides) + offset
          if (isTitle) {
            const props = {
              index: virtualIndex,
              currentIndex,
              id: `${batch}-title`,
              onClick: () => onClick(virtualIndex)
            }

            if (typeof title === 'function') return title(props)
            return <Title key={props.id} {...props} />
          }

          const id = `${batch}-${feature.id}`
          return (
            <FeatureCarouselItem
              feature={feature}
              index={virtualIndex}
              currentIndex={currentIndex}
              key={id}
              id={id}
              onClick={() => onClick(virtualIndex)}
              preTitle={showTitle && index % totalSlides === totalSlides - 1}
              postTitle={showTitle && index % totalSlides === 1}
            />
          )
        })}
      </div>
      <div
        className={cn(
          'absolute bottom-5 inset-x-5 flex items-center gap-3 sm:hidden z-20'
        )}
      >
        {Array.from({ length: totalSlides }).map((_, index) => {
          const isActive = index === activeIndex

          return (
            <button
              onClick={() => onClick(index)}
              className={cn(
                'transition-visible h-2 w-2 rounded-full bg-current',
                isActive ? 'opacity-100' : 'opacity-40'
              )}
              style={{ backgroundColor: color }}
              key={index}
            />
          )
        })}
        <button
          onClick={() => onClick(currentIndex - 1)}
          className="ml-auto"
          style={{ color }}
        >
          <ChevronLeft size={40} strokeWidth={1} />
        </button>
        <button onClick={() => onClick(currentIndex + 1)} style={{ color }}>
          <ChevronRight size={40} strokeWidth={1} />
        </button>
      </div>
    </motion.div>
  )
}

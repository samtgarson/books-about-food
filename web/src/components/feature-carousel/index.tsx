'use client'

import { Feature } from '@books-about-food/core/services/features/fetch-features'
import cn from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { useNav } from '../nav/context'
import { Faces } from './faces'
import { FeatureCarouselItem } from './item'
import { Title } from './title'

export type FeatureCarouselProps = {
  features: Feature[]
}

type Item =
  | { feature: Feature; title?: never }
  | { feature?: never; title: true }

const createLoop = (features: Feature[]): Item[] => {
  const featureItems = features.map((feature) => ({ feature }))
  const title = { title: true } as const

  const batch = [title, ...featureItems]
  return [...batch, ...batch, ...batch]
}

export const FeatureCarousel: FC<FeatureCarouselProps> = ({ features }) => {
  const [[currentIndex, offset], setState] = useState([features.length + 1, 0])
  const loop = createLoop(features)
  const totalSlides = useMemo(() => features.length + 1, [features.length])
  const showingTitle = useMemo(
    () => currentIndex % totalSlides === 0,
    [currentIndex, totalSlides]
  )
  const { setTheme, theme } = useNav()
  const activeIndex = currentIndex - (offset + 1) * totalSlides
  const mouseRef = useRef<[number, number][] | null>(null)

  useEffect(() => {
    setTheme(showingTitle ? 'dark' : 'light')
  }, [showingTitle, setTheme])

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
        'relative overflow-x-clip transition-colors w-full h-[90vh] max-h-[800px]',
        showingTitle ? 'bg-black' : 'bg-white'
      )}
    >
      <AnimatePresence>
        {showingTitle && <Faces features={features} />}
      </AnimatePresence>
      <div className={cn('absolute inset-x-0 bottom-16 sm:bottom-0 top-16')}>
        {loop.map(({ title, feature }, index) => {
          const virtualIndex = offset * totalSlides + index
          const batch = Math.floor(index / totalSlides) + offset
          if (title) {
            const id = `${batch}-title`
            return (
              <Title
                index={virtualIndex}
                currentIndex={currentIndex}
                id={id}
                key={id}
                onClick={() => onClick(virtualIndex)}
              />
            )
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
              preTitle={index % totalSlides === totalSlides - 1}
              postTitle={index % totalSlides === 1}
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

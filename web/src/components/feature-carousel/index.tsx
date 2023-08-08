'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { containerClasses } from '../atoms/container'
import { FeatureCarouselItem } from './item'
import { Title } from './title'
import cn from 'classnames'
import { Faces } from './faces'
import { useNav } from '../nav/context'

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
  const { setTheme } = useNav()

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

  if (!features.length) return null
  return (
    <motion.div
      layout
      className={cn(
        'transition-colors relative',
        showingTitle ? 'bg-black' : 'bg-white'
      )}
    >
      <AnimatePresence>
        {showingTitle && <Faces features={features} />}
      </AnimatePresence>
      <div
        className={cn(
          'w-full relative',
          containerClasses(),
          'lg:pl-[15vw] lg:pr-40'
        )}
      >
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
            />
          )
        })}
      </div>
    </motion.div>
  )
}

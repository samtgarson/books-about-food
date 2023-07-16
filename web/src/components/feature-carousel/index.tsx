'use client'

import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { Container } from '../atoms/container'
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
  // const title = { title: true } as const

  return [...featureItems, ...featureItems, ...featureItems]
}

export const FeatureCarousel: FC<FeatureCarouselProps> = ({ features }) => {
  const [[currentIndex, offset], setState] = useState([features.length, 0])
  const loop = createLoop(features)
  const totalSlides = features.length

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
    <motion.div layout className="pb-12 pt-16 lg:pb-52 mb:pb-52 bg-white">
      <Container belowNav>
        <motion.h2 className="all-caps-sm" layout>
          Today&apos;s Specials
        </motion.h2>
      </Container>
      <div className="w-full mt-8 lg:mt-32 relative">
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
            />
          )
        })}
      </div>
    </motion.div>
  )
}

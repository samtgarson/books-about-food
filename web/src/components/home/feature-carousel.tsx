'use client'

import cn from 'classnames'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FC, Fragment, useEffect, useState } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { Avatar } from '../atoms/avatar'
import { Container } from '../atoms/container'

export type FeatureCarouselProps = {
  features: Feature[]
}
const MotionLink = motion(Link)

const FeatureCarouselItem = ({
  feature,
  index,
  currentIndex,
  onClick,
  id
}: {
  feature: Feature
  index: number
  currentIndex: number
  onClick?: () => void
  id: string
}) => {
  const pos = {
    prev: index === currentIndex - 1,
    current: index === currentIndex,
    next: index === currentIndex + 1,
    offNext: index === currentIndex + 2,
    offPrev: index === currentIndex - 2
  }

  if (!pos.prev && !pos.current && !pos.next && !pos.offNext && !pos.offPrev)
    return null
  return (
    <MotionLink
      layoutId={id}
      layout="position"
      href={feature.book.href}
      onClick={(e) => {
        if (pos.current) return true
        e.preventDefault()
        onClick?.()
      }}
      transition={{ ease: 'easeInOut', duration: 0.4 }}
      className={cn(
        'flex items-start lg:items-center lg:justify-center gap-8 lg:gap-20 flex-col lg:flex-row h-full w-full max-w-4xl top-0',
        {
          'lg:mx-auto flex-grow px-5': pos.current,
          'absolute right-full lg:-mr-[44rem]': pos.prev,
          'absolute left-full -ml-24': pos.next,
          'absolute right-full': pos.offPrev,
          'absolute left-full': pos.offNext
        }
      )}
      animate={{
        opacity: pos.offPrev || pos.offNext ? 0 : 1
      }}
    >
      {feature.book.cover && (
        <Image
          {...feature.book.cover?.imageAttrs(360)}
          className="book-shadow max-w-none"
        />
      )}
      <div
        className={cn('flex-grow transition-opacity', {
          'opacity-0': !pos.current,
          'pt-10': !feature.tagLine
        })}
      >
        {feature.tagLine && (
          <p className="bg-black text-white all-caps-sm px-2.5 py-1.5 w-max mb-4">
            {feature.tagLine}
          </p>
        )}
        <h3 className="text-32 mb-2">{feature.book.title}</h3>
        <p className="text-14 lg:text-18 mb-4 lg:mb-8">{feature.description}</p>
        <div className="flex items-center gap-2">
          {feature.book.authors.map((author) => (
            <Fragment key={author.slug}>
              <Avatar
                profile={author}
                size="2xs"
                className="border border-black"
              />
              <p>{author.name}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </MotionLink>
  )
}

export const FeatureCarousel: FC<FeatureCarouselProps> = ({ features }) => {
  const [[currentIndex, offset], setState] = useState([features.length, 0])
  const loop = [...features, ...features, ...features]

  if (!features.length) return null
  return (
    <motion.div layout className="pb-12 pt-16 lg:pb-52 mb:pb-52 bg-white">
      <Container belowNav>
        <motion.h2 className="all-caps-sm" layout>
          Today&apos;s Specials
        </motion.h2>
      </Container>
      <div className="w-full mt-8 lg:mt-32 relative">
        {loop.map((feature, index) => {
          const virtualIndex = offset * features.length + index
          const batch = Math.floor(index / features.length) + offset
          const id = `${batch}-${feature.id}`
          return (
            <FeatureCarouselItem
              feature={feature}
              index={virtualIndex}
              currentIndex={currentIndex}
              key={id}
              id={id}
              onClick={() => {
                const rangeStart = (offset + 1) * features.length
                const rangeEnd = rangeStart + features.length - 1
                const newOffset =
                  virtualIndex < rangeStart
                    ? offset - 1
                    : virtualIndex > rangeEnd
                    ? offset + 1
                    : offset

                setState([virtualIndex, newOffset])
              }}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

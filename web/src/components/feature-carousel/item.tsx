'use client'
import cn from 'classnames'
import Image from 'next/image'
import { Fragment } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { Avatar } from '../atoms/avatar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

const MotionLink = motion(Link)

export function FeatureCarouselItem({
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
}) {
  const { current, attrs, display } = useFeatureCarouselItem({
    index,
    currentIndex
  })

  if (!display) return null
  return (
    <MotionLink
      layoutId={id}
      layout="position"
      href={feature.book.href}
      onClick={(e) => {
        if (current) return true
        e.preventDefault()
        onClick?.()
      }}
      {...attrs}
    >
      {feature.book.cover && (
        <Image
          {...feature.book.cover?.imageAttrs(360)}
          className="book-shadow max-w-none h-[250px] sm:h-[360px] w-auto"
        />
      )}
      <div
        className={cn('flex-grow transition-opacity', {
          'opacity-0': !current,
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

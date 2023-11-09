'use client'
import cn from 'classnames'
import { Feature } from 'core/services/features/fetch-features'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { Avatar } from '../atoms/avatar'
import { mouseAttrs } from '../atoms/mouse'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

const MotionLink = motion(Link)

export function FeatureCarouselItem({
  feature,
  index,
  currentIndex,
  onClick,
  id,
  preTitle,
  postTitle
}: {
  feature: Feature
  index: number
  currentIndex: number
  onClick?: () => void
  id: string
  preTitle: boolean
  postTitle: boolean
}) {
  const { current, attrs, display, className, next, prev, mouseProps } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      preTitle,
      postTitle,
      imageWidth: feature.book.cover?.widthFor(360)
    })

  if (!display) return null
  return (
    <MotionLink
      layoutId={id}
      layout="position"
      href={current ? feature.book.href : '#'}
      {...attrs}
      className={cn(className)}
      onClick={(e) => {
        if (current) return true
        e.preventDefault()
        if (onClick) setTimeout(onClick, 0)
        return false
      }}
      title={next ? 'Next' : prev ? 'Previous' : undefined}
      {...mouseAttrs(mouseProps)}
    >
      {feature.book.cover && (
        <Image
          {...feature.book.cover?.imageAttrs(360)}
          className="book-shadow pointer-events-none h-[250px] w-auto max-w-none sm:h-[360px]"
        />
      )}
      <div
        className={cn('transition-opacity lg:flex-grow', {
          'opacity-0': !current,
          'pt-10': !feature.tagLine
        })}
      >
        {feature.tagLine && (
          <p className="all-caps-sm mb-4 w-max bg-black px-2.5 py-1.5 text-white">
            {feature.tagLine}
          </p>
        )}
        <p className="text-14 lg:text-18 mb-4 max-w-xl lg:mb-8">
          {feature.description}
        </p>
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

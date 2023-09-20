'use client'
import cn from 'classnames'
import Image from 'next/image'
import { Fragment } from 'react'
import { Feature } from 'src/services/features/fetch-features'
import { Avatar } from '../atoms/avatar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useFeatureCarouselItem } from './use-feature-carousel-item'
import { mouseAttrs } from '../atoms/mouse'

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
          className="book-shadow max-w-none h-[250px] sm:h-[360px] w-auto pointer-events-none"
        />
      )}
      <div
        className={cn('transition-opacity lg:flex-grow', {
          'opacity-0': !current,
          'pt-10': !feature.tagLine
        })}
      >
        {feature.tagLine && (
          <p className="bg-black text-white all-caps-sm px-2.5 py-1.5 w-max mb-4">
            {feature.tagLine}
          </p>
        )}
        <p className="text-14 lg:text-18 mb-4 lg:mb-8 max-w-xl">
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

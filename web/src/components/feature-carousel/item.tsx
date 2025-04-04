'use client'
import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import Image from 'next/image'
import { Fragment } from 'react'
import { Avatar } from '../atoms/avatar'
import { mouseAttrs } from '../atoms/mouse'
import { FeatureCarouselSlide } from './slide'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

export type FeatureCarouselFeature = {
  id: string
  book: Book
  title?: string | null
  tagLine?: string | null
}

export function FeatureCarouselItem({
  feature,
  index,
  currentIndex,
  onClick,
  id,
  preTitle,
  postTitle
}: {
  feature: FeatureCarouselFeature
  index: number
  currentIndex: number
  onClick: () => void
  id: string
  preTitle: boolean
  postTitle: boolean
}) {
  const { current, attrs, display, className, mouseProps, position } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      preTitle,
      postTitle,
      imageWidth: feature.book.cover?.widthFor(360)
    })

  if (!display) return null
  return (
    <FeatureCarouselSlide
      position={position}
      {...attrs}
      id={id}
      href={current ? feature.book.href : '#'}
      className={className}
      onClick={onClick}
      {...mouseAttrs(mouseProps)}
    >
      {feature.book.cover && (
        <Image
          {...feature.book.cover?.imageAttrs(360)}
          className="book-shadow pointer-events-none h-[250px] w-auto max-w-none sm:h-[360px] short:h-[200px]"
        />
      )}
      <div
        className={cn('max-w-[80vw] transition-opacity lg:flex-grow', {
          'opacity-0 duration-300': !current,
          'duration-700': current,
          'pt-10': !feature.tagLine
        })}
      >
        {feature.tagLine && (
          <p className="all-caps-sm mb-4 w-max bg-black px-2.5 py-1.5 text-white short:hidden">
            {feature.tagLine}
          </p>
        )}
        {feature.title && (
          <p className="mb-2 max-w-xl text-24 lg:text-40">{feature.title}</p>
        )}
        {feature.book.designCommentary && (
          <p className="mb-4 line-clamp-3 max-w-xl text-14 lg:mb-8 lg:text-18">
            {feature.book.designCommentary}
          </p>
        )}
        <div className="flex items-center gap-2">
          {feature.book.authors.map((author) => (
            <Fragment key={author.slug}>
              <Avatar profile={author} size="2xs" mobileSize="3xs" />
              <p>{author.name}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </FeatureCarouselSlide>
  )
}

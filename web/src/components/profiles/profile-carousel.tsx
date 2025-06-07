'use client'

import { Profile } from '@books-about-food/core/models/profile'
import { AuthorItem } from 'app/(main)/authors/item'
import cn from 'classnames'
import { FC } from 'react'
import * as Carousel from 'src/components/atoms/carousel'

export type ProfileCarouselProps = {
  items: Profile[]
  // size: 'md' | 'lg' | 'xl'
  className?: string
  // centered?: boolean
}

export const ProfileCarousel: FC<ProfileCarouselProps> = ({
  items,
  className
}) => {
  // const width = size === 'md' ? 150 : size === 'lg' ? 250 : 350
  const total = items.length

  return (
    <Carousel.Root
      className={cn('overflow-x-hidden', className)}
      totalItems={total}
      alignment="center"
      startOn={1}
    >
      <Carousel.Scroller
        padded
        containerProps={false}
        className="-mr-px gap-12 lg:gap-24"
      >
        {items.map((item, index) => (
          <Carousel.Item key={item.id} index={index}>
            <AuthorItem profile={item} className="w-[245px]!" />
          </Carousel.Item>
        ))}
      </Carousel.Scroller>
      <Carousel.Buttons />
      <Carousel.Centerer slideWidth={224} lgSlideWidth={288} />
    </Carousel.Root>
  )
}

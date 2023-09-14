'use client'

import { FC } from 'react'
import { Book } from 'src/models/book'
import * as Carousel from 'src/components/atoms/carousel'
import { Item as BookItem } from './item'
import { Container } from '../atoms/container'
import Link from 'next/link'
import cn from 'classnames'

export type ItemCarouselProps = {
  items: Book[]
  title?: string
  size?: 'md' | 'lg' | 'xl'
  readMoreLink?: string
  className?: string
  centered?: boolean
  carouselClassName?: string
  allCaps?: boolean
} & Partial<
  Omit<Carousel.CarouselRootProps, 'totalItems' | 'alignment' | 'children'>
>

export const itemCarouselWidths = {
  md: 150,
  lg: 250,
  xl: 350
}

export const ItemCarousel: FC<ItemCarouselProps> = ({
  items,
  title,
  size = 'md',
  readMoreLink,
  className,
  centered,
  carouselClassName,
  allCaps,
  ...props
}) => {
  const width = itemCarouselWidths[size]
  const total = readMoreLink ? items.length + 1 : items.length

  return (
    <div className={className}>
      {title && (
        <Container>
          <h3 className={cn('mb-8', allCaps && 'all-caps')}>{title}</h3>
        </Container>
      )}
      <Carousel.Root
        {...props}
        totalItems={total}
        alignment={centered ? 'center' : 'left'}
        className={cn('overflow-x-hidden', carouselClassName)}
      >
        <Carousel.Scroller
          padded
          containerProps={{ right: false }}
          className="-mr-px"
        >
          {items.map((item, index) => (
            <Carousel.Item
              key={item.id}
              index={index}
              className={cn(centered && '-mx-[45px]')}
            >
              <BookItem
                mobileGrid
                book={item}
                style={{ width }}
                className={cn('self-start max-w-[90vw]')}
                centered={centered}
              />
            </Carousel.Item>
          ))}
          {readMoreLink && (
            <Carousel.Item index={items.length}>
              <li
                style={{ width: width + 1 }}
                className="max-w-[90vw] self-start mr-px"
              >
                <Link
                  className="flex flex-col items-center justify-center aspect-square bg-white border border-black text-24"
                  href={readMoreLink}
                >
                  View More
                </Link>
              </li>
            </Carousel.Item>
          )}
        </Carousel.Scroller>
        <Carousel.Buttons />
        {centered && (
          <Carousel.Centerer slideWidth={width} lastSlideWidth={false} />
        )}
      </Carousel.Root>
    </div>
  )
}

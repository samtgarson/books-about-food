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
  ...props
}) => {
  const width = itemCarouselWidths[size]
  const total = readMoreLink ? items.length + 1 : items.length

  return (
    <div className={className}>
      {title && (
        <Container>
          <h3 className={cn('all-caps mb-8')}>{title}</h3>
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
                className={cn('max-w-[90vw] self-start')}
                centered={centered}
              />
            </Carousel.Item>
          ))}
          {readMoreLink && (
            <Carousel.Item index={items.length}>
              <li
                style={{ width: width + 1 }}
                className="mr-px max-w-[90vw] self-start"
              >
                <Link
                  className="text-24 flex aspect-square flex-col items-center justify-center border border-black bg-white"
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

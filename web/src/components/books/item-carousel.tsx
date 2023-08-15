'use client'

import { FC } from 'react'
import { Book } from 'src/models/book'
import * as Carousel from 'src/components/atoms/carousel'
import { Item as BookItem } from './item'
import { Container } from '../atoms/container'
import Link from 'next/link'

export type ItemCarouselProps = {
  items: Book[]
  title?: string
  size: 'md' | 'lg' | 'xl'
  readMoreLink?: string
  className?: string
  centered?: boolean
}

export const ItemCarousel: FC<ItemCarouselProps> = ({
  items,
  title,
  size,
  readMoreLink,
  className,
  centered
}) => {
  const width = size === 'md' ? 150 : size === 'lg' ? 250 : 350
  const total = readMoreLink ? items.length + 1 : items.length

  return (
    <div className={className}>
      {title && (
        <Container>
          <h3 className="all-caps mb-8">{title}</h3>
        </Container>
      )}
      <Carousel.Root
        totalItems={total}
        alignment={centered ? 'center' : 'left'}
        className="overflow-x-hidden"
      >
        <Carousel.Scroller
          padded
          containerProps={{ right: false }}
          className="-mr-px"
        >
          {items.map((item, index) => (
            <Carousel.Item key={item.id} index={index}>
              <BookItem
                mobileGrid
                book={item}
                style={{ width }}
                className="self-start max-w-[90vw]"
                centered={centered}
              />
            </Carousel.Item>
          ))}
          {readMoreLink && (
            <Carousel.Item index={items.length}>
              <li
                style={{ width: width + 1 }}
                className="max-w-[90vw] self-start"
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
      </Carousel.Root>
    </div>
  )
}

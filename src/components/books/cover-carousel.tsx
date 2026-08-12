'use client'

import Image from 'next/image'
import { FC, useContext } from 'react'
import * as Carousel from 'src/components/atoms/carousel'
import { CarouselContext } from 'src/components/atoms/carousel/context'
import { FullBook } from 'src/core/models/full-book'

export type CoverCarouselProps = {
  book: FullBook
  className?: string
}

const CoverFlood: FC<{ color?: string }> = ({ color }) => {
  const { currentIndex } = useContext(CarouselContext)
  if (!color) return null

  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 transition-opacity duration-700"
      style={{ backgroundColor: color, opacity: currentIndex === 0 ? 1 : 0 }}
    />
  )
}

export const CoverCarousel: FC<CoverCarouselProps> = ({ book, className }) => {
  let images = book.previewImages
  if (book.cover) images = [book.cover, ...images]
  if (images.length === 0) return null

  const firstImage = images[0]
  const lastImage = images[images.length - 1]
  return (
    <>
      <Carousel.Root totalItems={images.length} className={className}>
        <CoverFlood color={book.backgroundColor} />
        <Carousel.Scroller className="w-full gap-24 py-16 lg:py-4">
          {images.map((image, i) => (
            <Carousel.Item key={image.id} index={i}>
              <li>
                <Image
                  {...image.imageAttrs(440)}
                  loading="eager"
                  className="h-[210px] w-auto max-w-none book-shadow md:h-[310px] xl:h-[440px]"
                />
              </li>
            </Carousel.Item>
          ))}
        </Carousel.Scroller>
        {images.length > 1 && <Carousel.Buttons />}
        <Carousel.Centerer
          slideWidth={firstImage.widthFor(210)}
          lastSlideWidth={lastImage.widthFor(210)}
          mdSlideWidth={firstImage.widthFor(310)}
          mdLastSlideWidth={lastImage.widthFor(310)}
          lgSlideWidth={firstImage.widthFor(440)}
          lgLastSlideWidth={lastImage.widthFor(440)}
        />
      </Carousel.Root>
    </>
  )
}

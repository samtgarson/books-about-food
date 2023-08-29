'use client'

import Image from 'next/image'
import { FC } from 'react'
import * as Carousel from 'src/components/atoms/carousel'
import { FullBook } from 'src/models/full-book'

export type CoverCarouselProps = {
  book: FullBook
  className?: string
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
        <Carousel.Scroller className="gap-24 w-full py-16 lg:py-4">
          {images.map((image, i) => (
            <Carousel.Item key={image.id} index={i}>
              <li>
                <Image
                  {...image.imageAttrs(440)}
                  loading="eager"
                  className="max-w-none h-[210px] md:h-[310px] xl:h-[440px] w-auto book-shadow"
                />
              </li>
            </Carousel.Item>
          ))}
        </Carousel.Scroller>
        {images.length > 1 && <Carousel.Buttons />}
        <Carousel.Centerer
          slideWidth={firstImage.widthFor(220)}
          lastSlideWidth={lastImage.widthFor(220)}
          mdSlideWidth={firstImage.widthFor(310)}
          mdLastSlideWidth={lastImage.widthFor(310)}
          lgSlideWidth={firstImage.widthFor(440)}
          lgLastSlideWidth={lastImage.widthFor(440)}
        />
      </Carousel.Root>
    </>
  )
}

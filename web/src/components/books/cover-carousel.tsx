'use client'

import cn from 'classnames'
import { Image as ImageModel } from 'src/models/image'
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

  const id = `cover-carousel-${book.id}`
  const firstImage = images[0]
  const lastImage = images[images.length - 1]
  return (
    <>
      <Carousel.Root items={images}>
        <div className={cn('relative', className)}>
          <Carousel.Scroller<ImageModel>
            id={id}
            className="gap-24 w-full sm:py-36"
          >
            {(image, i) => (
              <Carousel.Item key={image.id} index={i}>
                <Image
                  {...image.imageAttrs(440)}
                  loading="eager"
                  className="max-w-none h-[210px] md:h-[310px] xl:h-[440px] w-auto book-shadow"
                />
              </Carousel.Item>
            )}
          </Carousel.Scroller>
          {images.length > 1 && (
            <Carousel.Buttons className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex -mr-px" />
          )}
        </div>
      </Carousel.Root>
      <style>{`
        #${id} li:first-child {
          padding-left: calc(50% - ${firstImage.widthFor(220) / 2}px);
        }

        #${id} li:last-child {
          padding-right: calc(50% - ${lastImage.widthFor(220) / 2}px);
        }

        @media (min-width: 768px) {
          #${id} li:first-child {
            padding-left: calc(50% - ${firstImage.widthFor(310) / 2}px);
          }

          #${id} li:last-child {
            padding-right: calc(50% - ${lastImage.widthFor(310) / 2}px);
          }
        }

        @media (min-width: 1280px) {
          #${id} li:first-child {
            padding-left: calc(50% - ${firstImage.widthFor(440) / 2}px);
          }

          #${id} li:last-child {
            padding-right: calc(50% - ${lastImage.widthFor(440) / 2}px);
          }
        }
      `}</style>
    </>
  )
}

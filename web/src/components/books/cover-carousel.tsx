'use client'

import { FC, useState } from 'react'
import * as Carousel from 'src/components/atoms/carousel'
import Image from 'next/image'
import { FullBook } from 'src/models/full-book'
import { Image as ImageModel } from 'src/models/image'
import { X } from 'react-feather'
import cn from 'classnames'

export type CoverCarouselProps = {
  book: FullBook
  className?: string
}

export const CoverCarousel: FC<CoverCarouselProps> = ({ book, className }) => {
  const [focusedImage, setFocusedImage] = useState<ImageModel>()

  let images = book.previewImages
  if (book.cover) images = [book.cover, ...images]
  if (images.length === 0) return null

  const id = `cover-carousel-${book.id}`
  const firstImage = images[0]
  const lastImage = images[images.length - 1]
  return (
    <>
      <Carousel.Root id={id} className={cn(className, 'gap-24 w-full')}>
        {images.map((image, i) => (
          <Carousel.Item
            key={image.id}
            onClick={(e) => setFocusedImage(image)}
            index={i}
          >
            <Image
              {...image.imageAttrs(440)}
              className="max-w-none h-[210px] md:h-[310px] xl:h-[440px] w-auto"
            />
          </Carousel.Item>
        ))}
      </Carousel.Root>
      <style>{`
        #${id} li:first-child {
          margin-left: calc(50% - ${firstImage.widthFor(220) / 2}px);
        }

        #${id} li:last-child {
          margin-right: calc(50% - ${lastImage.widthFor(220) / 2}px);
        }

        @media (min-width: 768px) {
          #${id} li:first-child {
            margin-left: calc(50% - ${firstImage.widthFor(310) / 2}px);
          }

          #{id} li:last-child {
            margin-right: calc(50% - ${lastImage.widthFor(310) / 2}px);
          }
        }

        @media (min-width: 1280px) {
          #${id} li:first-child {
            margin-left: calc(50% - ${firstImage.widthFor(440) / 2}px);
          }

          #{id} li:last-child {
            margin-right: calc(50% - ${lastImage.widthFor(440) / 2}px);
          }
        }
      `}</style>
      {focusedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 animate-fade-slide-in z-50"
          onClick={() => setFocusedImage(undefined)}
        >
          <button
            onClick={() => setFocusedImage(undefined)}
            className="absolute right-4 top-6 bg-transparent text-white"
          >
            <X strokeWidth={1} size={32} />
          </button>
          <Image
            {...focusedImage.imageAttrs()}
            className="object-contain !inset-x-16 !inset-y-8 !w-[calc(100%-128px)] !h-[calc(100%-64px)]"
          />
        </div>
      )}
    </>
  )
}

import { FC } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { FullBook } from 'src/models/full-book'

export type CoverCarouselProps = {
  book: FullBook
  className?: string
}

export const CoverCarousel: FC<CoverCarouselProps> = ({ book, className }) => {
  const images = book.previewImages
  if (book.cover) images.unshift(book.cover)

  if (images.length === 0) return null

  const id = `cover-carousel-${book.id}`
  const firstImage = images[0]
  const lastImage = images[images.length - 1]
  return (
    <div
      className={cn(
        'relative w-full overflow-x-auto snap-x snap-mandatory snap-always',
        className
      )}
    >
      <ul
        id={id}
        className="flex gap-24 whitespace-nowrap py-16 w-max h-full items-center"
      >
        {images.map((preview) => (
          <li key={preview.id} className="snap-center">
            <Image
              {...preview.imageAttrs(440)}
              className="max-w-none h-[210px] xl:h-[440px] w-auto"
            />
          </li>
        ))}
      </ul>
      <style>{`
        #${id} {
          padding-left: calc(50% - ${firstImage.widthFor(220) / 2}px);
          padding-right: calc(50% - ${lastImage.widthFor(220) / 2}px);
        }

        @media (min-width: 1280px) {
          #${id} {
            padding-left: calc(50% - ${firstImage.widthFor(440) / 2}px);
            padding-right: calc(50% - ${lastImage.widthFor(440) / 2}px);
          }
        }
      `}</style>
    </div>
  )
}

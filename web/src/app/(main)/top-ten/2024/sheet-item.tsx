import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import Image from 'next/image'
import { CSSProperties } from 'react'
import { Star, X } from 'src/components/atoms/icons'
import { bookGridItemId } from 'src/components/books/item'

export function TopTenSheetItem({
  book,
  onDeselect
}: {
  book?: Model
  onDeselect: () => void
}) {
  if (!book) {
    return (
      <li className="h-[100px] w-[75px] rounded bg-sand flex items-center justify-center scale-90 sm:scale-100">
        <Star strokeWidth={1} className="opacity-20" />
      </li>
    )
  }

  return (
    <li className="relative h-[100px] scale-90 sm:scale-100">
      <button
        className="w-[--cover-width]"
        style={
          {
            ['--cover-width']: `${book.cover?.widthFor(100)}px`
          } as CSSProperties
        }
        onClick={function () {
          return document
            .querySelector(`#${bookGridItemId(book.id)}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }}
      >
        {book.cover && (
          <Image
            {...book.cover.imageAttrs(100)}
            className="rounded animate-scale-in h-[100px]"
          />
        )}
      </button>
      <button
        onClick={onDeselect}
        title="Remove"
        className={cn(
          'absolute top-0 right-0 size-6 bg-black text-white rounded-full flex items-center justify-center -mr-3 -mt-3'
        )}
      >
        <X size={14} />
      </button>
    </li>
  )
}

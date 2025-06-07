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
      <li className="flex h-[100px] w-[75px] scale-90 items-center justify-center rounded-sm bg-sand sm:scale-100">
        <Star strokeWidth={1} className="opacity-20" />
      </li>
    )
  }

  return (
    <li className="relative h-[100px] scale-90 sm:scale-100">
      <button
        className="w-(--cover-width)"
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
            className="h-[100px] animate-scale-in rounded-sm"
          />
        )}
      </button>
      <button
        onClick={onDeselect}
        title="Remove"
        className={cn(
          'absolute right-0 top-0 -mr-3 -mt-3 flex size-6 items-center justify-center rounded-full bg-black text-white'
        )}
      >
        <X size={14} />
      </button>
    </li>
  )
}

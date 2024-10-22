import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import Image from 'next/image'
import { Star, X } from 'react-feather'

export function TopTenSheetItem({
  book,
  onDeselect
}: {
  book?: Model
  onDeselect: () => void
}) {
  return (
    <li
      className={cn(
        'flex items-center justify-center h-[100px] w-[75px] bg-sand rounded relative'
      )}
    >
      {book?.cover ? (
        <Image
          {...book.cover.imageAttrs(100)}
          className="absolute inset-0 object-cover w-full h-full rounded animate-scale-in"
        />
      ) : (
        <Star strokeWidth={1} className="opacity-20" />
      )}
      {book && (
        <button
          onClick={onDeselect}
          title="Remove"
          className={cn(
            'absolute top-0 right-0 size-6 bg-black text-white rounded-full flex items-center justify-center -mr-3 -mt-3'
          )}
        >
          <X size={14} />
        </button>
      )}
    </li>
  )
}

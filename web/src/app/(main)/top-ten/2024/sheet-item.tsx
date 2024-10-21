import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useMemo } from 'react'
import { Star, X } from 'react-feather'

const stackAngles = [0, -8, 12]
const gap = 15

function getLeftOffset(i: number, count: number) {
  const windowWidth = window.innerWidth - 24 * 2
  const totalWidth = 75 * count + gap * 2
  const leftOffset = (windowWidth - totalWidth) / 2
  return leftOffset + i * (75 + gap)
}

export function TopTenSheetItem({
  expand,
  book,
  onDeselect,
  i,
  totalCount
}: {
  expand: boolean
  book?: Model
  onDeselect: () => void
  i: number
  totalCount: number
}) {
  const x = useMemo(
    () => (expand ? getLeftOffset(i, totalCount) : 0),
    [i, totalCount, expand]
  )

  return (
    <motion.li
      layout="position"
      className={cn(
        'flex items-center justify-center h-[100px] w-[75px] bg-sand rounded absolute sm:relative sm:!rotate-0',
        i > 0 && !book && 'opacity-0 sm:opacity-100'
      )}
      animate={{
        rotate: expand ? 0 : `${stackAngles[i]}deg`,
        x
      }}
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
            'absolute top-0 right-0 size-6 bg-black text-white rounded-full flex items-center justify-center -mr-3 -mt-3',
            !expand && 'opacity-0 sm:opacity-100'
          )}
        >
          <X size={14} />
        </button>
      )}
    </motion.li>
  )
}

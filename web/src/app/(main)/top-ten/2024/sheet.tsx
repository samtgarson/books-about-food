'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronLeft, Star, X } from 'react-feather'
import { Button } from 'src/components/atoms/button'
import { range } from 'src/utils/array-helpers'

type TopTenSheetProps = {
  selected: Model[]
  unselectBook: (book: Model) => void
}

const stackAngles = [0, -8, 12]
const gap = 15

export function TopTenSheet({ selected, unselectBook }: TopTenSheetProps) {
  const [expandStack, setExpandStack] = useState(false)

  function getLeftOffset(i: number) {
    const windowWidth = window.innerWidth - 24 * 2
    const totalWidth = 75 * selected.length + gap * 2
    const leftOffset = (windowWidth - totalWidth) / 2
    return leftOffset + i * (75 + gap)
  }

  useEffect(() => {
    setExpandStack(false)
  }, [selected])

  return (
    <div className="z-sheet rounded-t-[16px] sm:rounded-2xl backdrop-blur-3xl fixed bottom-0 sm:bottom-6 left-0 right-0 sm:w-min bg-white/80 mx-auto book-shadow p-6 sm:p-8 flex gap-8 flex-col sm:flex-row sm:items-center">
      <motion.ul
        className={cn(
          'sm:flex gap-3 relative h-[100px]',
          expandStack && 'flex'
        )}
      >
        {expandStack && (
          <button onClick={() => setExpandStack(false)} className="sm:hidden">
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
        )}
        {range(3).map((_, i) => {
          const book = selected[i] as Model | undefined
          return (
            <motion.li
              key={i}
              layout="position"
              className={cn(
                'flex items-center justify-center h-[100px] w-[75px] bg-sand rounded absolute sm:relative sm:!rotate-0',
                i > 0 && !book && 'opacity-0 sm:opacity-100'
              )}
              animate={{
                rotate: expandStack ? 0 : `${stackAngles[i]}deg`,
                x: expandStack ? getLeftOffset(i) : 0
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
                  onClick={() => unselectBook(book)}
                  title="Remove"
                  className={cn(
                    'absolute top-0 right-0 size-6 bg-black text-white rounded-full flex items-center justify-center -mr-3 -mt-3',
                    !expandStack && 'opacity-0 sm:opacity-100'
                  )}
                >
                  <X size={14} />
                </button>
              )}
            </motion.li>
          )
        })}
        {!expandStack && selected.length > 0 && (
          <button
            onClick={() => setExpandStack(true)}
            className="w-[75px] h-[100px] relative sm:hidden animate-scale-in"
          >
            <span className="size-8 ml-[21.5px] bg-black text-white rounded-full flex items-center justify-center">
              {selected.length}
            </span>
          </button>
        )}
      </motion.ul>
      <Button disabled={selected.length < 3} variant="dark" className="sm:w-32">
        {selected.length === 3
          ? 'Submit'
          : `${3 - selected.length} ${
              selected.length === 2 ? 'vote' : 'votes'
            } left`}
      </Button>
    </div>
  )
}

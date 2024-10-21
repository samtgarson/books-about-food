'use client'

import { Book as Model } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { Button } from 'src/components/atoms/button'
import { range } from 'src/utils/array-helpers'
import { useMediaQuery } from 'usehooks-ts'
import { TopTenSheetItem } from './sheet-item'

type TopTenSheetProps = {
  selected: Model[]
  unselectBook: (book: Model) => void
}

export function TopTenSheet({ selected, unselectBook }: TopTenSheetProps) {
  const [expandStack, setExpandStack] = useState(false)

  const submitDisabled = selected.length < 3
  const submitLabel =
    selected.length === 3
      ? 'Submit'
      : `${3 - selected.length} ${
          selected.length === 2 ? 'vote' : 'votes'
        } remaining`

  const isMobile = useMediaQuery('(max-width: 640px)')

  useEffect(() => {
    setExpandStack(false)
  }, [isMobile])

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
        {range(3).map((_, i) => (
          <TopTenSheetItem
            key={i}
            i={i}
            totalCount={selected.length}
            expand={expandStack}
            onDeselect={() => unselectBook(selected[i])}
            book={selected[i]}
          />
        ))}
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
      <Button
        disabled={submitDisabled}
        variant={submitDisabled ? 'tertiary' : 'dark'}
        className="sm:w-44"
      >
        {submitLabel}
      </Button>
    </div>
  )
}

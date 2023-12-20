'use client'

import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { FC } from 'react'
import { Plus } from 'src/components/atoms/icons'
import { useSheet } from '../sheets/global-sheet'

export type CorrectionButtonProps = {
  book: Book
  className?: string
}

export const CorrectionButton: FC<CorrectionButtonProps> = ({
  book,
  className
}) => {
  const { openSheet } = useSheet()

  return (
    <button
      className={cn('text-14 flex items-center gap-4', className)}
      onClick={() => {
        openSheet('suggestEdit', { resource: book })
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p className="text-left">
        Know anyone{!!book.team.length && ' else'} who was involved in this
        project?
      </p>
    </button>
  )
}

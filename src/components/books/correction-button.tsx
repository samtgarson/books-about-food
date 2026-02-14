'use client'

import cn from 'classnames'
import { FC } from 'react'
import { Plus } from 'src/components/atoms/icons'
import { Book } from 'src/core/models/book'
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
      className={cn('flex items-center gap-4 text-14', className)}
      onClick={() => {
        openSheet('suggestEdit', { resource: book })
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p className="text-left">Suggest more team members</p>
    </button>
  )
}

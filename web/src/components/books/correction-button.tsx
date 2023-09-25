import cn from 'classnames'
import Link from 'next/link'
import { FC } from 'react'
import { Plus } from 'react-feather'
import { Book } from 'src/models/book'

export type CorrectionButtonProps = {
  book: Book
  className?: string
}

export const CorrectionButton: FC<CorrectionButtonProps> = ({
  book,
  className
}) => {
  return (
    <Link
      href={`/submit?bookId=${book.id}`}
      className={cn('text-14 flex items-center gap-4', className)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p>
        Know anyone{!!book.team.length && ' else'} who was involved in this
        project?
      </p>
    </Link>
  )
}

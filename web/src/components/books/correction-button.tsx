import Link from 'next/link'
import { FC } from 'react'
import { Plus } from 'react-feather'
import cn from 'classnames'
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
      className={cn('flex gap-4 items-center text-14', className)}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
        <Plus size={23} strokeWidth={1} />
      </div>
      <p>Know anyone who was involved in this project?</p>
    </Link>
  )
}

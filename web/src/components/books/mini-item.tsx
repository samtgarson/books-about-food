import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Book } from 'src/core/models/book'
import { StatusTag } from './status-tag'

export function MiniItem({
  book,
  children,
  className
}: {
  book: Book
  children?: ReactNode
  className?: string
}) {
  return (
    <Link
      href={`/edit/${book.slug}`}
      className={cn(
        '-mb-px flex h-[85px] items-center gap-4 border border-black px-5 py-4 sm:-mr-px',
        className
      )}
    >
      {book.cover ? (
        <Image {...book.cover.imageAttrs(50)} />
      ) : (
        <div className="h-[50px] w-9 shrink-0 bg-khaki"></div>
      )}
      <div className="flex flex-col overflow-hidden">
        <p className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
          {book.title}
        </p>
        {!!book.authors.length && (
          <p className="overflow-hidden text-12 text-ellipsis whitespace-nowrap">
            {book.authorNames}
          </p>
        )}
      </div>
      {children ?? (
        <StatusTag className="ml-auto text-10!" status={book.status} />
      )}
    </Link>
  )
}

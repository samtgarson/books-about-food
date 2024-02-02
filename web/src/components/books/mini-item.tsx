import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
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
        'h-[85px] px-5 py-4 border border-black flex gap-4 -mb-px sm:-mr-px items-center',
        className
      )}
    >
      {book.cover ? (
        <Image {...book.cover.imageAttrs(50)} />
      ) : (
        <div className="w-9 h-[50px] bg-khaki shrink-0"></div>
      )}
      <div className="flex flex-col overflow-hidden">
        <p className="font-medium whitespace-nowrap text-ellipsis overflow-hidden">
          {book.title}
        </p>
        {!!book.authors.length && (
          <p className="text-12 whitespace-nowrap text-ellipsis overflow-hidden">
            {book.authorNames}
          </p>
        )}
      </div>
      {children ?? (
        <StatusTag className="ml-auto !text-10" status={book.status} />
      )}
    </Link>
  )
}

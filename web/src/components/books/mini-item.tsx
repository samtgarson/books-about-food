import { Book } from '@books-about-food/core/models/book'
import Image from 'next/image'
import Link from 'next/link'
import { StatusTag } from './status-tag'

export function MiniItem({ book }: { book: Book }) {
  return (
    <Link
      href={`/edit/${book.slug}`}
      className="h-[85px] px-5 py-4 border border-black flex gap-4 -mb-px sm:-mr-px items-center"
    >
      {book.cover ? (
        <Image {...book.cover.imageAttrs(50)} />
      ) : (
        <div className="w-9 h-[50px] bg-khaki"></div>
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
      <StatusTag className="ml-auto !text-10" status={book.status} />
    </Link>
  )
}

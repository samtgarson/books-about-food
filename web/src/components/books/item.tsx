import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'
import cn from 'classnames'

export type CookbookItemProps = {
  book: Book
  className?: string
}

export const BookItem = ({ book, className }: CookbookItemProps) => {
  return (
    <li className={cn('', className)}>
      <Link
        href={`/cookbooks/${book.slug}`}
        className="-mb-px sm:mb-0 sm:-mr-px sm:w-auto h-full flex sm:flex-col sm:items-start items-center sm:gap-0 gap-6 p-4 sm:p-0 border sm:border-none border-black"
      >
        <div className="sm:aspect-square sm:border border-black sm:mb-6 relative flex items-center justify-center w-24 sm:w-full">
          {book.cover ? (
            <Image
              alt={book.cover.caption}
              src={book.cover.src}
              width={book.cover.widthFor(200)}
              height={200}
              className="sm:absolute h-24 sm:!h-[80%] sm:!top-[10%] sm:mx-auto sm:inset-x-0 !w-auto book-shadow"
            />
          ) : (
            <div
              aria-hidden
              className="sm:absolute h-24 sm:!h-[80%] sm:!top-[10%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-white"
            />
          )}
        </div>
        <div className="sm:pr-4 sm:mt-auto w-full">
          <p className="font-medium text-16 mb-1">{book.title}</p>
          <p className="text-14">{book.authorNames}</p>
        </div>
      </Link>
    </li>
  )
}
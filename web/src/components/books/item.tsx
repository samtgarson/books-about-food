import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'
import cn from 'classnames'
import { ComponentProps } from 'react'

export type CookbookItemProps = ComponentProps<'li'> & {
  book: Book
  mobileGrid?: boolean
}

export const BookItem = ({
  book,
  className,
  mobileGrid,
  ...props
}: CookbookItemProps) => {
  return (
    <li className={cn('group', className)} {...props}>
      <Link
        href={book.href}
        className={cn(
          '-mb-px group-last:mb-0 sm:mb-0 sm:-mr-px sm:w-auto h-full flex sm:flex-col sm:items-start sm:gap-0 p-4 sm:p-0 border relative items-center gap-6 border-black sm:border-none',
          mobileGrid &&
            'mb-0 -mr-px w-auto flex-col items-start gap-0 p-0 border-none'
        )}
      >
        <div
          className={cn(
            'sm:aspect-square sm:border border-black sm:mb-6 relative flex items-center justify-center sm:w-full',
            mobileGrid ? 'aspect-square border mb-6 w-full' : 'w-24'
          )}
        >
          {book.cover ? (
            <Image
              {...book.cover.imageAttrs(200)}
              className={cn(
                'sm:absolute h-24 sm:!h-[80%] sm:!top-[10%] sm:mx-auto sm:inset-x-0 !w-auto book-shadow',
                mobileGrid && 'absolute h-[80%] top-[10%] mx-auto inset-x-0'
              )}
            />
          ) : (
            <div
              aria-hidden
              className={cn(
                'sm:absolute h-24 sm:!h-[80%] sm:!top-[10%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-white',
                mobileGrid &&
                  'absolute h-[80%] top-[10%] mx-auto inset-x-0 w-[60%]'
              )}
            />
          )}
        </div>
        <div
          className={cn(
            'sm:pr-4 sm:mt-auto w-full',
            mobileGrid && 'pr-4 mt-auto'
          )}
        >
          <p className="font-medium text-16 mb-1">{book.title}</p>
          <p className="text-14">{book.authorNames}</p>
        </div>
        {book.publishedInFuture && (
          <span className="absolute right-px top-px bg-white all-caps-sm px-3 py-1.5">
            {book.shortReleaseDate}
          </span>
        )}
      </Link>
    </li>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'
import cn from 'classnames'
import { CSSProperties, ComponentProps, useId } from 'react'

export type CookbookItemProps = ComponentProps<'li'> & {
  mobileGrid?: boolean
  index?: number
} & (
    | {
      book: Book
      skeleton?: never
    }
    | {
      book?: never
      skeleton: true
    }
  )

export const BookItem = ({
  book,
  className,
  mobileGrid,
  skeleton,
  index = 0,
  ...props
}: CookbookItemProps) => {
  return (
    <li className={cn('group', className)} {...props}>
      <Link
        href={book?.href ?? '#'}
        className={cn(
          '-mb-px group-last:mb-0 sm:mb-0 sm:-mr-px sm:w-auto h-full flex sm:flex-col sm:items-start sm:gap-0 p-4 sm:p-0 border relative items-center gap-6 border-black sm:border-none',
          mobileGrid &&
          'mb-0 -mr-px w-auto flex-col items-start gap-0 p-0 border-none',
          skeleton && `animate-pulse`
        )}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div
          className={cn(
            'sm:aspect-square sm:border border-black sm:mb-6 relative flex items-center justify-center sm:w-full',
            mobileGrid ? 'aspect-square border mb-6 w-full' : 'w-24',
            skeleton && 'border-darkSand'
          )}
        >
          {book?.cover ? (
            <Image
              {...book.cover.imageAttrs(200)}
              className={cn(
                'sm:absolute h-24 sm:!h-[70%] sm:!top-[15%] sm:mx-auto sm:inset-x-0 !w-auto book-shadow',
                mobileGrid && 'absolute h-[70%] top-[15%] mx-auto inset-x-0'
              )}
            />
          ) : (
            <div
              aria-hidden
              className={cn(
                'sm:absolute h-24 sm:!h-[70%] sm:!top-[15%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-darkSand',
                mobileGrid &&
                'absolute h-[70%] top-[15%] mx-auto inset-x-0 w-[60%]'
              )}
            />
          )}
        </div>
        <div className={cn('sm:pr-4 w-full', mobileGrid && 'pr-4')}>
          {book ? (
            <>
              <p className="font-medium text-16 mb-1">{book.title}</p>
              <p className="text-14">{book.authorNames}</p>
            </>
          ) : (
            <>
              <div className="inline-block h-4 w-40 mb-1 bg-darkSand"></div>
              <div className="inline-block h-3.5 w-30 bg-darkSand"></div>
            </>
          )}
        </div>
        {book?.publishedInFuture && (
          <span className="absolute right-px top-px bg-white all-caps-sm px-3 py-1.5">
            {book.shortReleaseDate}
          </span>
        )}
      </Link>
    </li>
  )
}

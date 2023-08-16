import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'
import cn from 'classnames'
import { ComponentProps, ReactNode } from 'react'

export type CookbookItemProps = ComponentProps<'li'> & {
  mobileGrid?: boolean
  index?: number
  book?: Book
  centered?: boolean
}

export const Container = ({
  className,
  mobileGrid,
  book,
  index = 0,
  skeleton,
  children,
  ...props
}: CookbookItemProps & { skeleton?: boolean }) => {
  const WrapperEl = book?.href ? Link : 'div'
  return (
    <li className={cn('group', className)} {...props}>
      <WrapperEl
        href={book?.href || '#'}
        className={cn(
          '-mb-px group-last:mb-0 sm:mb-0 sm:-mr-px sm:w-auto h-full flex sm:flex-col sm:items-start sm:gap-0 sm:p-0 border relative items-center gap-6 border-black sm:border-none',
          mobileGrid
            ? 'mb-0 -mr-px w-auto flex-col items-start gap-0 p-0 border-none'
            : 'p-4',
          skeleton && `animate-pulse`
        )}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {children}
      </WrapperEl>
    </li>
  )
}

export const Box = ({
  children,
  mobileGrid,
  skeleton,
  className,
  bordered = true
}: {
  children: ReactNode
  mobileGrid?: boolean
  skeleton?: boolean
  className?: string
  bordered?: boolean
}) => (
  <div
    className={cn(
      className,
      'sm:aspect-square border-black sm:mb-6 relative flex items-center justify-center sm:w-full',
      mobileGrid ? 'aspect-square mb-6 w-full' : 'w-24',
      skeleton && 'border-khaki',
      bordered && (mobileGrid ? 'border' : 'sm:border')
    )}
  >
    {children}
  </div>
)

export const Item = ({
  book,
  mobileGrid,
  centered,
  ...props
}: CookbookItemProps & { book: Book }) => {
  return (
    <Container mobileGrid={mobileGrid} book={book} {...props}>
      <Box mobileGrid={mobileGrid} skeleton={!book} bordered={!centered}>
        {book?.publishedInFuture && !centered && (
          <span className="absolute right-px top-px bg-white all-caps-sm px-3 py-1.5">
            {book.shortReleaseDate}
          </span>
        )}
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
              'sm:absolute h-24 sm:!h-[70%] sm:!top-[15%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-khaki',
              mobileGrid &&
              'absolute h-[70%] top-[15%] mx-auto inset-x-0 w-[60%]'
            )}
          />
        )}
      </Box>

      <div
        className={cn(
          'sm:pr-4 w-full',
          mobileGrid && 'pr-4',
          centered && 'text-center'
        )}
      >
        <p className="font-medium text-16 mb-1">{book.title}</p>
        <p className="text-14">{book.authorNames}</p>
      </div>
    </Container>
  )
}

export const Skeleton = ({
  className,
  mobileGrid,
  index = 0,
  ...props
}: CookbookItemProps) => (
  <Container
    className={className}
    mobileGrid={mobileGrid}
    index={index}
    skeleton
    {...props}
  >
    <Box mobileGrid={mobileGrid} skeleton>
      <div
        aria-hidden
        className={cn(
          'sm:absolute h-24 sm:!h-[70%] sm:!top-[15%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-khaki',
          mobileGrid && 'absolute h-[70%] top-[15%] mx-auto inset-x-0 w-[60%]'
        )}
      />
    </Box>
    <div className={cn('sm:pr-4 w-full opacity-50', mobileGrid && 'pr-4')}>
      <p className="h-4 w-40 mb-1 bg-khaki"></p>
      <p className="h-3.5 w-30 bg-khaki"></p>
    </div>
  </Container>
)

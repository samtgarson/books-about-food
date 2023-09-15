import Image from 'next/image'
import Link from 'next/link'
import { Book } from 'src/models/book'
import cn from 'classnames'
import { CSSProperties, forwardRef } from 'react'

export interface CookbookItemProps {
  mobileGrid?: boolean
  index?: number
  book?: Book
  centered?: boolean
  skeleton?: boolean
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
}

export const Container = forwardRef<
  HTMLLIElement,
  CookbookItemProps & {
    skeleton?: boolean
    link?: boolean
  }
>(function Container(
  {
    className,
    mobileGrid,
    book,
    index = 0,
    skeleton,
    children,
    link = true,
    centered,
    style
  },
  ref
) {
  const WrapperEl = book?.href && link ? Link : 'div'
  return (
    <li className={cn('group', className)} ref={ref}>
      <WrapperEl
        href={book?.href || '#'}
        className={cn(
          '-mb-px group-last:mb-0 sm:mb-0 sm:-mr-px sm:w-auto h-full flex sm:flex-col sm:items-start sm:gap-0 sm:p-0 border relative items-center gap-6 border-black sm:border-none',
          mobileGrid
            ? 'mb-0 -mr-px w-auto flex-col items-start gap-0 p-0 border-none'
            : 'p-4',
          skeleton && `animate-pulse`
        )}
        style={{ ...style, animationDelay: `${index * 150}ms` }}
        aria-label={book?.ariaLabel}
        title={book?.title}
      >
        {children}
        {book?.publishedInFuture && !centered && (
          <span className="absolute right-px top-px bg-white all-caps-sm px-3 py-1.5">
            {book.shortReleaseDate}
          </span>
        )}
      </WrapperEl>
    </li>
  )
})

export const Box = ({
  children,
  mobileGrid,
  skeleton,
  className,
  bordered = true
}: CookbookItemProps & { bordered?: boolean }) => (
  <div
    className={cn(
      className,
      'sm:aspect-square border-black sm:mb-6 flex items-center justify-center sm:w-full relative',
      mobileGrid ? 'aspect-square w-full' : 'w-24',
      skeleton && 'border-khaki',
      bordered && (mobileGrid ? 'border' : 'sm:border')
    )}
  >
    {children}
  </div>
)

export const Cover = ({
  book,
  mobileGrid,
  centered,
  className
}: CookbookItemProps & { book: Book }) => (
  <Box
    mobileGrid={mobileGrid}
    skeleton={!book}
    bordered={!centered}
    className={className}
  >
    {book?.cover ? (
      <Image
        {...book.cover.imageAttrs(200)}
        className={cn(
          'sm:absolute h-24 sm:h-[70%] sm:top-[15%] sm:mx-auto sm:inset-x-0 !w-auto book-shadow',
          mobileGrid && 'absolute h-[70%] top-[15%] mx-auto inset-x-0'
        )}
      />
    ) : (
      <div
        aria-hidden
        className={cn(
          'sm:absolute h-24 sm:!h-[70%] sm:!top-[15%] sm:mx-auto sm:inset-x-0 w-16 sm:w-[60%] bg-opacity-50 bg-khaki',
          mobileGrid && 'absolute h-[70%] top-[15%] mx-auto inset-x-0 w-[60%]'
        )}
      />
    )}
  </Box>
)

export const Footer = ({
  mobileGrid,
  centered,
  children,
  className
}: CookbookItemProps) => (
  <div
    className={cn(
      className,
      'sm:pr-4 w-full',
      mobileGrid && 'pr-4',
      centered && 'text-center -mt-[50px]'
    )}
  >
    {children}
  </div>
)

export const Item = forwardRef<
  HTMLLIElement,
  CookbookItemProps & { book: Book }
>(function Item({ skeleton, ...props }, ref) {
  if (skeleton) return <Skeleton {...props} ref={ref} />
  const { book, mobileGrid, centered, ...rest } = props
  return (
    <Container
      mobileGrid={mobileGrid}
      book={book}
      centered={centered}
      {...rest}
      ref={ref}
    >
      <Cover book={book} mobileGrid={mobileGrid} centered={centered} />
      <Footer mobileGrid={mobileGrid} centered={centered}>
        <p className="font-medium text-16 mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {book.title}
        </p>
        <p className="text-14 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {book.authorNames}
        </p>
      </Footer>
    </Container>
  )
})

export const Skeleton = forwardRef<
  HTMLLIElement,
  Omit<CookbookItemProps, 'skeleton'>
>(function Skeleton({ className, mobileGrid, index = 0, ...props }, ref) {
  return (
    <Container
      className={className}
      mobileGrid={mobileGrid}
      index={index}
      skeleton
      {...props}
      ref={ref}
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
})

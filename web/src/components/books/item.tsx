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
          'relative -mb-px flex h-full items-center gap-6 border border-black group-last:mb-0 sm:-mr-px sm:mb-0 sm:w-auto sm:flex-col sm:items-start sm:gap-0 sm:border-none sm:p-0',
          mobileGrid
            ? '-mr-px mb-0 w-auto flex-col items-start gap-0 border-none p-0'
            : 'p-4',
          skeleton && `animate-pulse`
        )}
        style={{ ...style, animationDelay: `${index * 150}ms` }}
        aria-label={book?.ariaLabel}
        title={book?.title}
      >
        {children}
        {book?.publishedInFuture && !centered && (
          <span className="all-caps-sm absolute right-px top-px bg-white px-3 py-1.5">
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
      'relative flex shrink-0 items-center justify-center border-black sm:mb-6 sm:aspect-square sm:w-full',
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
          'book-shadow h-24 !w-auto sm:absolute sm:inset-x-0 sm:top-[15%] sm:mx-auto sm:h-[70%]',
          mobileGrid && 'absolute inset-x-0 top-[15%] mx-auto h-[70%]'
        )}
      />
    ) : (
      <div
        aria-hidden
        className={cn(
          'bg-khaki h-24 w-16 bg-opacity-50 sm:absolute sm:inset-x-0 sm:!top-[15%] sm:mx-auto sm:!h-[70%] sm:w-[60%]',
          mobileGrid && 'absolute inset-x-0 top-[15%] mx-auto h-[70%] w-[60%]'
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
      'min-w-0 sm:w-full sm:pr-4',
      mobileGrid && 'pr-4',
      centered && '-mt-[50px] text-center'
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
        <p className="text-16 mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
          {book.title}
        </p>
        <p className="text-14 overflow-hidden overflow-ellipsis whitespace-nowrap">
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
            'bg-khaki h-24 w-16 bg-opacity-50 sm:absolute sm:inset-x-0 sm:!top-[15%] sm:mx-auto sm:!h-[70%] sm:w-[60%]',
            mobileGrid && 'absolute inset-x-0 top-[15%] mx-auto h-[70%] w-[60%]'
          )}
        />
      </Box>
      <div className={cn('w-full opacity-50 sm:pr-4', mobileGrid && 'pr-4')}>
        <p className="bg-khaki mb-1 h-4 w-40"></p>
        <p className="w-30 bg-khaki h-3.5"></p>
      </div>
    </Container>
  )
})

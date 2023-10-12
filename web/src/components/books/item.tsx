'use client'

import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { CSSProperties, forwardRef } from 'react'
import { Book } from 'src/models/book'
import { useListDisplay } from '../lists/list-context'

export interface CookbookItemProps {
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
  const { display } = useListDisplay()
  const WrapperEl = book?.href && link ? Link : 'div'
  return (
    <li className={cn('group', className)} ref={ref}>
      <WrapperEl
        href={book?.href || '#'}
        className={cn(
          'relative -mb-px flex h-full items-center gap-6 border border-black group-last:mb-0 sm:-mr-px sm:mb-0 sm:w-auto sm:flex-col sm:items-start sm:gap-0 sm:border-none sm:p-0',
          display === 'grid'
            ? '-mr-px sm:mb-0 w-auto flex-col items-start gap-0 border-none p-0'
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
  skeleton,
  className,
  bordered = true
}: CookbookItemProps & { bordered?: boolean }) => {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'

  return (
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
}

export const Cover = ({
  book,
  centered,
  className
}: CookbookItemProps & { book: Book }) => {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'

  return (
    <Box skeleton={!book} bordered={!centered} className={className}>
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
}

export const Footer = ({
  centered,
  children,
  className
}: CookbookItemProps) => {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'

  return (
    <div
      className={cn(
        className,
        'min-w-0 sm:w-full',
        mobileGrid && !centered && 'pr-4',
        centered ? '-mt-[50px] text-center px-14' : 'sm:pr-4'
      )}
    >
      {children}
    </div>
  )
}

export const Item = forwardRef<
  HTMLLIElement,
  CookbookItemProps & { book: Book }
>(function Item({ skeleton, ...props }, ref) {
  const { display } = useListDisplay()
  if (skeleton) return <Skeleton {...props} ref={ref} />
  const { book, centered, ...rest } = props
  return (
    <Container book={book} centered={centered} {...rest} ref={ref}>
      <Cover book={book} centered={centered} />
      {(display === 'list' || centered) && (
        <Footer centered={centered}>
          <p className="text-16 mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap font-medium">
            {book.title}
          </p>
          <p className="text-14 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {book.authorNames}
          </p>
        </Footer>
      )}
    </Container>
  )
})

export const Skeleton = forwardRef<
  HTMLLIElement,
  Omit<CookbookItemProps, 'skeleton'>
>(function Skeleton({ className, index = 0, ...props }, ref) {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'

  return (
    <Container
      className={className}
      index={index}
      skeleton
      {...props}
      ref={ref}
    >
      <Box skeleton>
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

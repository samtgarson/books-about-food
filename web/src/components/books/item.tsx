'use client'

import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { CSSProperties, ComponentProps, forwardRef } from 'react'
import { useListDisplay } from '../lists/list-context'
import { useNav } from '../nav/context'

export interface CookbookItemProps {
  index?: number
  book?: Book
  centered?: boolean
  skeleton?: boolean
  children?: React.ReactNode
  className?: string
  style?: CSSProperties
}

export function bookGridItemId(id?: string) {
  if (!id) return
  return `book-grid-${id}`
}

export const Container = forwardRef<
  HTMLLIElement,
  CookbookItemProps & {
    link?: boolean
    onClick?: () => void
    disabled?: boolean
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
    style,
    onClick,
    disabled
  },
  ref
) {
  const { display } = useListDisplay()
  const WrapperEl = book?.href && link ? Link : onClick ? 'button' : 'div'
  return (
    <li
      className={cn('group z-20', className)}
      ref={ref}
      aria-label={book?.title}
      id={bookGridItemId(book?.id)}
    >
      <WrapperEl
        href={book?.href || '#'}
        className={cn(
          'relative -mb-px flex h-full items-center gap-6 border border-black group-last:mb-0 sm:-mr-px sm:mb-0 sm:w-[calc(100%+1px)] sm:flex-col sm:items-start sm:gap-0 sm:border-none sm:p-0',
          display === 'grid'
            ? 'w-[calc(100%+1px) -mr-px flex-col items-start gap-0 border-none p-0 sm:mb-0'
            : 'w-full p-4',
          skeleton && `animate-pulse`
        )}
        style={{ ...style, animationDelay: `${index * 150}ms` }}
        aria-label={book?.ariaLabel}
        title={book?.title}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
        {book?.publishedInFuture && !centered && !skeleton && (
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
  bordered = true,
  style,
  book,
  ...props
}: CookbookItemProps & { bordered?: boolean } & ComponentProps<'div'>) => {
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
      style={{ ...style, '--book-bg': book?.backgroundColor } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

export const Cover = ({
  centered,
  book,
  className,
  colorful,
  mobileColorful = !colorful && !centered,
  ...props
}: CookbookItemProps & { colorful?: boolean; mobileColorful?: boolean }) => {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'

  return (
    <Box
      bordered={!centered}
      book={book}
      className={cn(
        className,
        colorful && (mobileGrid ? 'bg-(--book-bg)' : 'sm:bg-(--book-bg)'),
        mobileColorful && [
          mobileGrid && 'max-sm:bg-(--book-bg)',
          'sm:group-hover:bg-(--book-bg) sm:transition'
        ]
      )}
      {...props}
    >
      {book?.cover ? (
        <Image
          {...book.cover.imageAttrs(200)}
          className={cn(
            'book-shadow w-auto! h-24 sm:absolute sm:inset-x-0 sm:top-[15%] sm:mx-auto sm:h-[70%]',
            mobileGrid && 'absolute inset-x-0 top-[15%] mx-auto h-[70%]'
          )}
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            'sm:top-[15%]! sm:h-[70%]! bg-khaki/50 h-24 w-16 sm:absolute sm:inset-x-0 sm:mx-auto sm:w-[60%]',
            mobileGrid && 'absolute inset-x-0 top-[15%] mx-auto h-[70%] w-[60%]'
          )}
        />
      )}
    </Box>
  )
}

export const Footer = ({
  centered,
  book,
  children,
  className
}: CookbookItemProps) => {
  const { display } = useListDisplay()
  const mobileGrid = display === 'grid'
  const content =
    children ||
    (book && (
      <>
        {' '}
        <p className="text-16 mb-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
          {book.title}
        </p>
        <p className="text-14 overflow-hidden text-ellipsis whitespace-nowrap">
          {book.authorNames}
        </p>
      </>
    ))

  return (
    <div
      className={cn(
        className,
        'min-w-0 sm:w-full',
        mobileGrid && !centered && 'pr-4',
        centered ? '-mt-[50px] px-14 text-center' : 'text-left sm:pr-4'
      )}
    >
      {content}
    </div>
  )
}

export const Item = forwardRef<
  HTMLLIElement,
  CookbookItemProps & {
    book: Book
    colorful?: boolean
    mobileColorful?: boolean
  }
>(function Item({ skeleton, colorful, mobileColorful, ...props }, ref) {
  const { display } = useListDisplay()
  const { internalLoading } = useNav()

  if (skeleton || internalLoading) return <Skeleton {...props} ref={ref} />
  const { book, centered, ...rest } = props
  return (
    <Container book={book} centered={centered} {...rest} ref={ref}>
      <Cover
        book={book}
        centered={centered}
        mobileColorful={mobileColorful}
        colorful={colorful}
      />
      <Footer
        centered={centered}
        book={book}
        className={cn(display === 'grid' && 'hidden sm:block')}
      />
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
            'sm:top-[15%]! sm:h-[70%]! bg-khaki/50 h-24 w-16 sm:absolute sm:inset-x-0 sm:mx-auto sm:w-[60%]',
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

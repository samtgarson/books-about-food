import { Book } from '@books-about-food/core/models/book'
import cn from 'classnames'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { randomBelow } from 'src/utils/array-helpers'
import { GridContainer, GridContainerProps } from '../lists/grid-container'
import { Wrap } from '../utils/wrap'
import { Item } from './item'

export type BookGridProps = {
  books: Book[]
  showEmpty?: boolean
  itemProps?: Partial<ComponentPropsWithoutRef<typeof Item>>
  randomInsert?: ReactNode
} & Omit<GridContainerProps, 'ref'>

export function BookGrid({
  books,
  showEmpty = true,
  itemProps,
  className,
  randomInsert,
  ...gridProps
}: BookGridProps) {
  const randomInsertIndex = randomInsert
    ? Math.floor(randomBelow(books.length / 2) + books.length / 4)
    : null

  return (
    <>
      <GridContainer className={cn('sm:gap-y-16', className)} {...gridProps}>
        {books.map((book, i) => (
          <>
            <Wrap c={Item} key={book.id} book={book} {...itemProps} />
            {i === randomInsertIndex && randomInsert}
          </>
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </>
  )
}

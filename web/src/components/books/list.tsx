import {
  FetchBooksInput,
  fetchBooks
} from '@books-about-food/core/services/books/fetch-books'
import { Pagination } from 'src/components/lists/pagination'
import { call } from 'src/utils/service'
import { GridContainer } from '../lists/grid-container'
import { Wrap } from '../utils/wrap'
import { Item, Skeleton } from './item'

export type BookListProps = {
  filters?: FetchBooksInput
  showEmpty?: boolean
  title?: string
}

export const BookList = async ({
  filters = {},
  showEmpty = true,
  title
}: BookListProps) => {
  const { data } = await call(fetchBooks, filters)
  if (!data) return null

  const { books, filteredTotal, total, perPage } = data
  if (!books.length && !showEmpty) return null
  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
    >
      {title && <h3 className="all-caps my-4 sm:mb-8 sm:mt-0 ">{title}</h3>}
      <GridContainer className={'sm:gap-y-16'}>
        {books.map((book) => (
          <Wrap c={Item} key={book.id} props={{ book }} />
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

export const SkeletonBookList = () => (
  <Pagination total={100} perPage={18} filteredTotal={100}>
    <GridContainer className={'sm:gap-y-16'}>
      {Array.from({ length: 18 }, (_, i) => (
        <Skeleton key={i} index={i} />
      ))}
    </GridContainer>
  </Pagination>
)

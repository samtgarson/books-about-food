import { Pagination } from 'src/components/lists/pagination'
import {
  FetchBooksInput,
  FetchBooksOutput,
  fetchBooks
} from 'src/services/books/fetch-books'
import cn from 'classnames'
import { GridContainer } from '../lists/grid-container'
import { BookFilters } from './filters'
import { BookItem } from './item'

export type BookListProps = {
  filters?: FetchBooksInput
  showFilters?: boolean
  showEmpty?: boolean
  data?: FetchBooksOutput
}

export const BookList = async ({
  filters = {},
  showFilters = true,
  showEmpty = true
}: BookListProps) => {
  const { books, filteredTotal, total, perPage } = await fetchBooks.call(
    filters
  )

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
    >
      {showFilters && <BookFilters filters={filters} />}
      <GridContainer className={cn('sm:gap-y-16 transition-opacity')}>
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

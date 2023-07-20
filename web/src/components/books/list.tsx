import { Pagination } from 'src/components/lists/pagination'
import { FetchBooksInput, fetchBooks } from 'src/services/books/fetch-books'
import cn from 'classnames'
import { GridContainer } from '../lists/grid-container'
import { BookFilters } from './filters'
import { Item } from './item'
import { NewBookButton } from './new-book-button'

export type BookListProps = {
  filters?: FetchBooksInput
  showFilters?: boolean
  showEmpty?: boolean
  showCreate?: boolean
}

export const BookList = async ({
  filters = {},
  showFilters = true,
  showEmpty = true,
  showCreate = false
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
      <GridContainer className={cn('sm:gap-y-16')}>
        {books.map((book) => (
          <Item key={book.id} book={book} />
        ))}
        {showCreate && <NewBookButton />}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

import { Pagination } from 'src/components/lists/pagination'
import { FetchBooksInput, fetchBooks } from 'src/services/books/fetch-books'
import { GridContainer } from '../lists/grid-container'
import { Item, Skeleton } from './item'
import { NewBookButton } from './new-book-button'

export type BookListProps = {
  filters?: FetchBooksInput
  showEmpty?: boolean
  showCreate?: boolean
}

export const BookList = async ({
  filters = {},
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
      <GridContainer className={'sm:gap-y-16'}>
        {books.map((book) => (
          <Item key={book.id} book={book} />
        ))}
        {showCreate && <NewBookButton />}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

export const SkeletonBookList = () => (
  <GridContainer className={'sm:gap-y-16'}>
    {Array.from({ length: 10 }, (_, i) => (
      <Skeleton key={i} index={i} />
    ))}
  </GridContainer>
)

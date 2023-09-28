import { Pagination } from 'src/components/lists/pagination'
import { FetchBooksInput, fetchBooks } from 'src/services/books/fetch-books'
import { GridContainer } from '../lists/grid-container'
import { ClientDebug } from '../utils/client-debug'
import { Item, Skeleton } from './item'
import { NewBookButton } from './new-book-button'

export type BookListProps = {
  filters?: FetchBooksInput
  showEmpty?: boolean
  showCreate?: boolean
  title?: string
}

export const BookList = async ({
  filters = {},
  showEmpty = true,
  showCreate = false,
  title
}: BookListProps) => {
  const { data } = await fetchBooks.call(filters)
  if (!data) return null

  const { books, filteredTotal, total, perPage } = data
  if (!books.length && !showEmpty && !showCreate) return null
  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
    >
      {title && <h3 className="all-caps my-4 sm:mb-8 sm:mt-0 ">{title}</h3>}
      <GridContainer className={'sm:gap-y-16'}>
        {showCreate && <NewBookButton />}
        {books.map((book) => (
          <Item key={book.id} book={book} data-superjson />
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

export const SkeletonBookList = () => (
  <Pagination total={100} perPage={18} filteredTotal={100}>
    <ClientDebug source="skeleton book list" />
    <GridContainer className={'sm:gap-y-16'}>
      {Array.from({ length: 18 }, (_, i) => (
        <Skeleton key={i} index={i} />
      ))}
    </GridContainer>
  </Pagination>
)

import { Pagination } from 'src/components/lists/pagination'
import {
  FetchBooksInput,
  fetchBooks
} from 'src/core/services/books/fetch-books'
import { call } from 'src/utils/service'
import { BookGridCollectionTile } from '../collections/book-grid-collection-tile'
import { GridContainer } from '../lists/grid-container'
import { BookGrid, BookGridProps } from './grid'
import { Skeleton } from './item'

export type BookListProps = {
  filters?: FetchBooksInput
  title?: string
  showCollection?: boolean
} & Partial<BookGridProps>

export const BookList = async ({
  filters = {},
  title,
  showEmpty = true,
  showCollection,
  ...gridProps
}: BookListProps) => {
  const { data } = await call(fetchBooks, filters)
  if (!data) return null

  const { books, total, perPage } = data
  if (!books.length && !showEmpty) return null

  return (
    <Pagination total={total} perPage={perPage} page={filters.page ?? 0}>
      {title && <h3 className="my-4 all-caps sm:mt-0 sm:mb-8">{title}</h3>}
      <BookGrid
        {...gridProps}
        books={books}
        showEmpty={showEmpty}
        randomInsert={
          showCollection &&
          !filters.search && (
            <BookGridCollectionTile index={filters.page ?? 0} />
          )
        }
      />
    </Pagination>
  )
}

export const SkeletonBookList = () => (
  <Pagination total={100} perPage={24} filteredTotal={100}>
    <GridContainer className="sm:gap-y-16">
      {Array.from({ length: 24 }, (_, i) => (
        <Skeleton key={i} index={i} />
      ))}
    </GridContainer>
  </Pagination>
)

'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchBooksInput } from 'src/services/books/fetch-books'
import { GridContainer } from '../lists/grid-container'
import { BookFilters } from './filters'
import { BookItem } from './item'

export type BookListProps = {
  filters?: FetchBooksInput
  showFilters?: boolean
  showEmpty?: boolean
}

export const BookList: FC<BookListProps> = ({
  filters: initialFilters = {},
  showFilters = true,
  showEmpty = true
}) => {
  const [filters, setFilters] = useState<FetchBooksInput>(initialFilters)
  const { data } = useFetcher('books', filters)
  if (!data) return null
  const { books, filteredTotal, total, perPage } = data

  return (
    <>
      {showFilters && (
        <BookFilters
          filters={filters}
          onChange={(f) => setFilters({ ...filters, page: 0, ...f })}
        />
      )}
      <GridContainer className="sm:gap-y-16">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={filters.page ?? 0}
        filteredTotal={filteredTotal}
        onChange={(page) => setFilters({ ...filters, page })}
        onPreload={(page) => prefetch('books', { ...filters, page })}
      />
    </>
  )
}

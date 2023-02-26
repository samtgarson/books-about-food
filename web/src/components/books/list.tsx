'use client'

import { FC, useEffect, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import {
  FetchBooksInput,
  FetchBooksOutput
} from 'src/services/books/fetch-books'
import cn from 'classnames'
import { GridContainer } from '../lists/grid-container'
import { BookFilters } from './filters'
import { BookItem } from './item'
import { useDelayedFlag } from 'src/hooks/use-delayed-flag'

export type BookListProps = {
  filters?: FetchBooksInput
  showFilters?: boolean
  showEmpty?: boolean
  fallback?: FetchBooksOutput
}

export const BookList: FC<BookListProps> = ({
  filters: initialFilters = {},
  showFilters = true,
  showEmpty = true,
  fallback: fallbackData
}) => {
  const [filters, setFilters] = useState<FetchBooksInput>(initialFilters)
  const { data, isLoading } = useFetcher('books', filters, { fallbackData })
  const isLoadingSlow = useDelayedFlag(isLoading, 500)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('tags')) {
      setFilters((f) => ({ ...f, tags: params.get('tags')?.split(',') }))
    }
  }, [])

  if (!data) return null
  const { books, filteredTotal, total, perPage } = data

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
      onChange={(page) => setFilters({ ...filters, page })}
      onPreload={(page) => prefetch('books', { ...filters, page })}
    >
      {showFilters && (
        <BookFilters
          filters={filters}
          onChange={(f) => setFilters({ ...filters, page: 0, ...f })}
        />
      )}
      <GridContainer
        className={cn(
          'sm:gap-y-16 transition-opacity',
          isLoadingSlow && 'opacity-50'
        )}
      >
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </GridContainer>
      {books.length === 0 && showEmpty && <p>No books found</p>}
    </Pagination>
  )
}

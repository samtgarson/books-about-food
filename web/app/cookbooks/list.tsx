'use client'

import { useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchBooksInput } from 'src/services/books/fetch-books'
import { CookbooksFilters } from './filters'
import { CookbookItem } from './item'

export const CookbooksList = () => {
  const [filters, setFilters] = useState<FetchBooksInput>({})
  const { data } = useFetcher('books', filters)
  if (!data) return null
  const { books, filteredTotal, total, perPage } = data

  return (
    <>
      <CookbooksFilters
        filters={filters}
        onChange={(f) => setFilters({ ...filters, page: 0, ...f })}
      />
      <ul className='flex flex-wrap gap-4'>
        {books.map((book) => (
          <CookbookItem key={book.id} book={book} />
        ))}
      </ul>
      {books.length === 0 && <p>No books found</p>}
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

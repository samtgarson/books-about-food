import { FetchBooksInput } from '@books-about-food/core/services/books/fetch-books'
import { fetchTags } from '@books-about-food/core/services/tags/fetch'
import Link from 'next/link'
import { FilterBar } from 'src/components/lists/filter-bar'
import { call } from 'src/utils/service'
import stringify from 'stable-hash'
import { BookFilterPopup } from './popup'
import { count } from './util'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type BookFiltersProps = {
  filters?: Filters
}

export function BookFilters({ filters = {} }: BookFiltersProps) {
  const showReset = count(filters) > 0 || !!filters.sort

  return (
    <FilterBar
      title="Cookbooks"
      label={null}
      search={{
        value: filters.search
      }}
    >
      {showReset && (
        <Link className="all-caps mr-2" href="/cookbooks">
          Reset
        </Link>
      )}
      <BookFilterPopup
        key={stringify(filters)}
        filters={filters}
        fetchTags={async () => {
          'use server'
          const { data: tags = [] } = await call(fetchTags)
          return tags.map((tag) => ({
            label: tag.name,
            value: tag.slug
          }))
        }}
      />
    </FilterBar>
  )
}

import Link from 'next/link'
import { DisplayToggle } from 'src/components/lists/display-toggle'
import { FilterBar } from 'src/components/lists/filter-bar'
import { FetchBooksInput } from 'src/core/services/books/fetch-books'
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
      <DisplayToggle className="mr-auto sm:hidden" />
      {showReset && (
        <Link className="mr-2 all-caps" href="/cookbooks">
          Reset
        </Link>
      )}
      <BookFilterPopup key={stringify(filters)} filters={filters} />
    </FilterBar>
  )
}

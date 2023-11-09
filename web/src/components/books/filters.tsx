import { FetchBooksInput } from 'core/services/books/fetch-books'
import { fetchTags } from 'core/services/tags/fetch'
import { processArray } from 'core/services/utils/inputs'
import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { call } from 'src/utils/service'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type BookFiltersProps = {
  filters?: Filters
}

export function BookFilters({ filters = {} }: BookFiltersProps) {
  return (
    <FilterBar
      title="Cookbooks"
      search={{
        value: filters.search
      }}
    >
      <Sort<NonNullable<Filters['sort']>>
        sorts={{
          releaseDate: 'Release Date',
          createdAt: 'Recently Added'
        }}
        defaultValue="releaseDate"
        value={filters.sort ?? 'releaseDate'}
      />
      <FilterSelect
        search
        options={async () => {
          'use server'
          const { data: tags = [] } = await call(fetchTags)
          return tags.map((tag) => ({
            label: tag.name,
            value: tag.name
          }))
        }}
        placeholder="Tags"
        param="tags"
        value={processArray(filters.tags ?? [])}
        multi
      />
    </FilterBar>
  )
}

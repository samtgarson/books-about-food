import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchBooksPageFilters } from 'src/services/books/filters'
import { fetchTags } from 'src/services/tags/fetch'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type BookFiltersProps = {
  filters: Filters
}

export function BookFilters({ filters }: BookFiltersProps) {
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
          createdAt: 'Recently Added',
          title: 'Title'
        }}
        defaultValue="releaseDate"
        value={filters.sort ?? 'releaseDate'}
      />
      <FilterSelect
        search
        options={async () => {
          'use server'
          const tags = await fetchTags.call()
          return tags.map((tag) => ({
            label: tag.name,
            value: tag.name
          }))
        }}
        placeholder="Tags"
        param="tags"
        value={filters.tags}
        multi
      />
      <FilterSelect
        multi={false}
        param="pageCount"
        options={fetchBooksPageFilters}
        placeholder="No. of Pages"
        value={filters.pageCount}
      />
    </FilterBar>
  )
}

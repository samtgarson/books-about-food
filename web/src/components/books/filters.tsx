import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Search } from 'src/components/lists/search'
import { Sort } from 'src/components/lists/sort'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchBooksPageFilters } from 'src/services/books/filters'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type BookFiltersProps = {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
}

export const BookFilters = ({ filters, onChange }: BookFiltersProps) => {
  const { data: tags = [], isLoading } = useFetcher('tags', undefined, {
    immutable: true
  })

  return (
    <FilterBar
      search={
        <Search
          className="w-full"
          value={filters.search}
          onChange={(search) => onChange({ search })}
        />
      }
    >
      <Sort<NonNullable<Filters['sort']>>
        sorts={{
          releaseDate: 'Release Date',
          createdAt: 'Recently Added',
          title: 'Title'
        }}
        value={filters.sort ?? 'releaseDate'}
        onChange={(sort) => onChange({ sort })}
        onPreload={(sort) => prefetch('books', { sort })}
      />
      <FilterSelect
        search
        loading={isLoading}
        options={tags.map((tag) => ({
          label: tag.name,
          value: tag.name
        }))}
        placeholder="Tags"
        value={filters.tags}
        multi
        onChange={(tags) => onChange({ tags })}
      />
      <FilterSelect
        multi={false}
        options={fetchBooksPageFilters}
        placeholder="No. of Pages"
        value={filters.pageCount}
        onChange={(pageCount) => onChange({ pageCount })}
      />
    </FilterBar>
  )
}

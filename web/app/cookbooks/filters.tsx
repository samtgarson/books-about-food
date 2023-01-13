import { FilterSelect } from 'src/components/lists/filter-select'
import { Search } from 'src/components/lists/search'
import { Sort } from 'src/components/lists/sort'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchBooksInput } from 'src/services/books/fetch-books'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type CookbooksFiltersProps = {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
}

export const CookbooksFilters = ({
  filters,
  onChange
}: CookbooksFiltersProps) => {
  const { data: tags } = useFetcher('tags', undefined, { immutable: true })

  return (
    <div>
      <Sort<NonNullable<Filters['sort']>>
        sorts={{
          title: 'Title',
          releaseDate: 'Release Date',
          createdAt: 'Recently Added'
        }}
        value={filters.sort ?? 'releaseDate'}
        onChange={(sort) => onChange({ sort })}
        onPreload={(sort) => prefetch('books', { sort })}
      />
      {!tags ? (
        'Loading'
      ) : (
        <FilterSelect
          options={tags.map((tag) => ({ label: tag.name, value: tag.name }))}
          placeholder='All Tags'
          value={filters.tag}
          onChange={(tag) => onChange({ tag })}
          onPreload={(tag) => prefetch('books', { tag })}
        />
      )}
      <Search
        value={filters.search}
        onChange={(search) => onChange({ search })}
        placeholder='Search cookbooks'
      />
    </div>
  )
}

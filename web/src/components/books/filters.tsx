import { FilterSelect } from 'src/components/lists/filter-select'
import { Search } from 'src/components/lists/search'
import { Sort } from 'src/components/lists/sort'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchBooksInput } from 'src/services/books/fetch-books'
import { fetchBooksPageFilters } from 'src/services/books/filters'
import { AntiContainer, Container } from '../atoms/container'

type Filters = Omit<FetchBooksInput, 'page' | 'perPage'>
type BookFiltersProps = {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
}

export const BookFilters = ({ filters, onChange }: BookFiltersProps) => {
  const { data: tags } = useFetcher('tags', undefined, { immutable: true })

  return (
    <AntiContainer>
      <div className="my-10 flex flex-wrap items-center gap-4 w-full">
        <Container className="w-full flex-grow md:w-72">
          <Search
            className="w-full"
            value={filters.search}
            onChange={(search) => onChange({ search })}
          />
        </Container>
        <div className="overflow-x-auto">
          <Container className="flex gap-2 w-max">
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
            {!tags ? (
              'Loading'
            ) : (
              <FilterSelect
                search
                options={tags.map((tag) => ({
                  label: tag.name,
                  value: tag.name
                }))}
                placeholder="Tags"
                value={filters.tag}
                multi
                onChange={(tag) => onChange({ tag })}
              />
            )}
            <FilterSelect
              multi={false}
              options={fetchBooksPageFilters}
              placeholder="No. of Pages"
              value={filters.pageCount}
              onChange={(pageCount) => onChange({ pageCount })}
            />
          </Container>
        </div>
      </div>
    </AntiContainer>
  )
}

import { FilterBar } from 'src/components/lists/filter-bar'
import { Sort } from 'src/components/lists/sort'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'

export const AuthorFilters = ({ filters }: { filters: FetchProfilesInput }) => {
  return (
    <FilterBar
      title="Authors"
      search={{
        value: filters.search
      }}
    >
      <Sort
        sorts={{ name: 'Name', trending: 'Trending' }}
        value={filters.sort}
        defaultValue="trending"
      />
    </FilterBar>
  )
}

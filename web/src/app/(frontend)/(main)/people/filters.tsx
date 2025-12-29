import { FetchProfilesInput } from '@books-about-food/core/services/profiles/fetch-profiles'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { jobOptions, locationOptions } from './actions'

type PeopleFiltersProps = {
  filters: FetchProfilesInput
}

export const PeopleFilters = ({ filters }: PeopleFiltersProps) => {
  return (
    <FilterBar
      title="People Directory"
      search={{
        value: filters.search
      }}
    >
      <Sort
        sorts={{ name: 'Name', trending: 'Trending' }}
        value={filters.sort ?? 'name'}
        defaultValue="name"
      />
      <FilterSelect
        search
        options={jobOptions}
        placeholder="Roles"
        value={wrapArray(filters.jobs ?? [])}
        multi
        param="jobs"
      />
      <FilterSelect
        search
        options={async function (query: string) {
          'use server'
          return locationOptions(query, filters.locations)
        }}
        placeholder="Locations"
        value={wrapArray(filters.locations ?? [])}
        multi
        param="locations"
      />
    </FilterBar>
  )
}

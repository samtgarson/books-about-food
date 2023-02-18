'use client'

import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { useFetcher } from 'src/contexts/fetcher'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'

type PeopleFiltersProps = {
  filters: FetchProfilesInput
  onChange: (jobs: FetchProfilesInput) => void
  onPreload?: (jobs: FetchProfilesInput) => void
}

export const PeopleFilters = ({
  filters,
  onChange,
  onPreload
}: PeopleFiltersProps) => {
  const { data: jobs = [], isLoading } = useFetcher('jobs', undefined, {
    immutable: true
  })

  return (
    <FilterBar
      title="People"
      search={{
        value: filters.search,
        onChange: (search) => onChange({ search })
      }}
    >
      <Sort
        sorts={{ name: 'Name', trending: 'Trending' }}
        value={filters.sort ?? 'name'}
        onChange={(sort) => onChange({ ...filters, sort })}
        onPreload={(sort) => onPreload?.({ ...filters, sort })}
      />
      <FilterSelect
        search
        loading={isLoading}
        options={jobs.map((job) => ({
          label: job.name,
          value: job.id
        }))}
        placeholder="Roles"
        value={filters.jobs}
        multi
        onChange={(jobs) => onChange({ jobs })}
      />
    </FilterBar>
  )
}

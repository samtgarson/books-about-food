import { fetchJobs } from '@books-about-food/core/services/jobs/fetch-jobs'
import { FetchProfilesInput } from '@books-about-food/core/services/profiles/fetch-profiles'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { call } from 'src/utils/service'

type PeopleFiltersProps = {
  filters: FetchProfilesInput
}

export const PeopleFilters = ({ filters }: PeopleFiltersProps) => {
  const jobOptions = async () => {
    'use server'
    const { data: jobs = [] } = await call(fetchJobs)
    return jobs
      .filter((job) => job.name !== 'Author')
      .map((job) => ({
        label: job.name,
        value: job.id
      }))
  }

  return (
    <FilterBar
      title="People"
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
    </FilterBar>
  )
}

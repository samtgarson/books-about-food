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
      .map((job) => ({
        label: job.name,
        value: job.id
      }))
      .concat({ label: 'Author', value: 'author' })
  }

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
    </FilterBar>
  )
}

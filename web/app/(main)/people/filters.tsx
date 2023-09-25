import { FilterBar } from 'src/components/lists/filter-bar'
import { FilterSelect } from 'src/components/lists/filter-select'
import { Sort } from 'src/components/lists/sort'
import { fetchJobs } from 'src/services/jobs/fetch-jobs'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'
import { processArray } from 'src/services/utils/inputs'

type PeopleFiltersProps = {
  filters: FetchProfilesInput
}

export const PeopleFilters = ({ filters }: PeopleFiltersProps) => {
  const jobOptions = async () => {
    'use server'
    const { data: jobs = [] } = await fetchJobs.call()
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
        value={processArray(filters.jobs ?? [])}
        multi
        param="jobs"
      />
    </FilterBar>
  )
}

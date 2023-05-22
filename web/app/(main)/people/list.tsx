import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  fetchProfiles
} from 'src/services/profiles/fetch-profiles'
import { PeopleFilters } from './filters'
import { PeopleGrid } from './grid'

export type PeopleListProps = {
  filters?: FetchProfilesInput
}

export const PeopleList = async ({ filters = {} }: PeopleListProps) => {
  const { profiles, filteredTotal, total, perPage } = await fetchProfiles.call({
    ...filters,
    onlyAuthors: false
  })

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
    >
      <PeopleFilters filters={filters} />
      <PeopleGrid profiles={profiles} />
      {profiles.length === 0 && <p>No profiles found</p>}
    </Pagination>
  )
}

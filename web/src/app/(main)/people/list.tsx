import {
  FetchProfilesInput,
  fetchProfiles
} from 'core/services/profiles/fetch-profiles'
import { Pagination } from 'src/components/lists/pagination'
import { call } from 'src/utils/service'
import { PeopleGrid } from './grid'

export type PeopleListProps = {
  filters?: FetchProfilesInput
}

export const PeopleList = async ({ filters = {} }: PeopleListProps) => {
  const { data } = await call(fetchProfiles, {
    ...filters,
    onlyAuthors: false
  })
  if (!data) return null
  const { profiles, filteredTotal, total, perPage } = data

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
    >
      <PeopleGrid profiles={profiles} />
      {profiles.length === 0 && <p>No profiles found</p>}
    </Pagination>
  )
}

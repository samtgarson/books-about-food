import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  fetchProfiles
} from 'src/core/services/profiles/fetch-profiles'
import { call } from 'src/utils/service'
import { PeopleGrid } from './grid'

export type PeopleListProps = {
  filters?: FetchProfilesInput
}

export const PeopleList = async ({ filters = {} }: PeopleListProps) => {
  const { data } = await call(fetchProfiles, filters)
  if (!data) return null
  const { profiles, total, perPage } = data

  return (
    <Pagination total={total} perPage={perPage} page={filters.page ?? 0}>
      <PeopleGrid profiles={profiles} />
      {profiles.length === 0 && <p>No profiles found</p>}
    </Pagination>
  )
}

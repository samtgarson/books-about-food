import {
  FetchProfilesInput,
  fetchProfiles
} from 'core/services/profiles/fetch-profiles'
import { Pagination } from 'src/components/lists/pagination'
import { call } from 'src/utils/service'
import { AuthorsGrid } from './grid'

export type AuthorListProps = {
  filters?: FetchProfilesInput
}

export async function AuthorsList({ filters = {} }: AuthorListProps) {
  const { data } = await call(fetchProfiles, {
    sort: 'trending',
    ...filters,
    onlyAuthors: true
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
      <AuthorsGrid profiles={profiles} />
      {profiles.length === 0 && <p>No authors found</p>}
    </Pagination>
  )
}

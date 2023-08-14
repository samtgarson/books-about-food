import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  fetchProfiles
} from 'src/services/profiles/fetch-profiles'
import { AuthorsGrid } from './grid'

export type AuthorListProps = {
  filters?: FetchProfilesInput
}

export async function AuthorsList({ filters = {} }: AuthorListProps) {
  const { profiles, filteredTotal, total, perPage } = await fetchProfiles.call({
    sort: 'trending',
    ...filters,
    onlyAuthors: true
  })

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

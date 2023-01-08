import { Pagination } from 'src/components/lists/pagination'
import {
  fetchProfiles,
  FetchProfilesOptions
} from 'src/services/profiles/fetch'
import { AuthorItem } from './item'

type AuthorsListProps = {
  currentPath: string
  filters: Omit<FetchProfilesOptions, 'jobs'>
}

export const AuthorsList = async ({
  currentPath,
  filters: { page: pageParam }
}: AuthorsListProps) => {
  const page = Number(pageParam) || 0
  const { profiles, filteredTotal, total, perPage } = await fetchProfiles({
    page,
    onlyAuthors: true
  })

  return (
    <>
      <ul className='flex flex-wrap gap-4'>
        {profiles.map((profile) => (
          <AuthorItem key={profile.id} profile={profile} />
        ))}
      </ul>
      {profiles.length === 0 && <p>No authors found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={page}
        path={currentPath}
        filteredTotal={filteredTotal}
      />
    </>
  )
}

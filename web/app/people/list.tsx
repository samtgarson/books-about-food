import { Pagination } from 'src/components/lists/pagination'
import {
  fetchProfiles,
  FetchProfilesOptions
} from 'src/services/profiles/fetch'
import { PeopleItem } from './item'

type PeopleListProps = {
  currentPath: string
  filters: FetchProfilesOptions
}

export const PeopleList = async ({
  currentPath,
  filters: { page: pageParam, jobs }
}: PeopleListProps) => {
  const page = Number(pageParam) || 0
  const { profiles, filteredTotal, total, perPage } = await fetchProfiles({
    page,
    jobs,
    onlyAuthors: false
  })

  return (
    <>
      <ul className='flex flex-wrap gap-4'>
        {profiles.map((profile) => (
          <PeopleItem key={profile.id} profile={profile} />
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

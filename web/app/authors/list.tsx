'use client'

import { useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { AuthorItem } from './item'

export const AuthorsList = () => {
  const [filters, setFilters] = useState<FetchProfilesInput>({
    onlyAuthors: true
  })
  const { data } = useFetcher('profiles', filters)
  if (!data) return null
  const { profiles, filteredTotal, total, perPage } = data

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
        page={filters.page ?? 0}
        filteredTotal={filteredTotal}
        onChange={(page) => setFilters({ ...filters, page })}
        onPreload={(page) => prefetch('profiles', { ...filters, page })}
      />
    </>
  )
}

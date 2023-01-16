'use client'

import { useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { PeopleItem } from './item'
import { PeopleFilters } from './filters'
import { Container } from 'src/components/atoms/container'

export const PeopleList = () => {
  const [filters, setFilters] = useState<FetchProfilesInput>({
    onlyAuthors: false
  })
  const { data } = useFetcher('profiles', filters)
  if (!data) return null
  const { profiles, filteredTotal, total, perPage } = data

  return (
    <>
      <PeopleFilters
        value={filters.jobs ?? []}
        onChange={(jobs) => setFilters({ ...filters, page: 0, jobs })}
        onReset={() => setFilters({ ...filters, page: 0, jobs: [] })}
      />
      <Container>
        <ul className='grid auto-grid'>
          {profiles.map((profile) => (
            <PeopleItem key={profile.id} profile={profile} />
          ))}
        </ul>
        {profiles.length === 0 && <p>No profiles found</p>}
        <Pagination
          total={total}
          perPage={perPage}
          page={filters.page ?? 0}
          filteredTotal={filteredTotal}
          onChange={(page) => setFilters({ ...filters, page })}
          onPreload={(page) => prefetch('profiles', { ...filters, page })}
        />
      </Container>
    </>
  )
}

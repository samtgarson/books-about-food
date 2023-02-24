'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import {
  FetchProfilesInput,
  FetchProfilesOutput
} from 'src/services/profiles/fetch-profiles'
import { PeopleFilters } from './filters'
import { PeopleGrid } from './grid'

export type PeopleListProps = {
  fallback?: FetchProfilesOutput
}

export const PeopleList: FC<PeopleListProps> = ({ fallback: fallbackData }) => {
  const [filters, setFilters] = useState<FetchProfilesInput>({
    onlyAuthors: false
  })
  const { data, isLoading } = useFetcher('profiles', filters, { fallbackData })
  if (!data) return null
  const { profiles, filteredTotal, total, perPage } = data

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters.page ?? 0}
      filteredTotal={filteredTotal}
      onChange={(page) => setFilters({ ...filters, page })}
      onPreload={(page) => prefetch('profiles', { ...filters, page })}
    >
      <PeopleFilters
        filters={filters}
        onChange={(newFilters) =>
          setFilters({ ...filters, ...newFilters, page: 0 })
        }
        onPreload={(newFilters) =>
          prefetch('profiles', { ...filters, ...newFilters, page: 0 })
        }
      />
      <PeopleGrid profiles={profiles} loading={isLoading} />
      {profiles.length === 0 && <p>No profiles found</p>}
    </Pagination>
  )
}

'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  FetchProfilesOutput
} from 'src/services/profiles/fetch-profiles'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { Sort } from 'src/components/lists/sort'
import { FilterBar } from 'src/components/lists/filter-bar'
import { AuthorsGrid } from './grid'

export type AuthorListProps = {
  fallback?: FetchProfilesOutput
}

export const AuthorsList: FC<AuthorListProps> = ({
  fallback: fallbackData
}) => {
  const [filters, setFilters] = useState<FetchProfilesInput>({
    onlyAuthors: true,
    sort: 'trending'
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
      <FilterBar
        title="Authors"
        search={{
          value: filters.search,
          onChange: (search) => setFilters({ ...filters, search })
        }}
      >
        <Sort
          sorts={{ name: 'Name', trending: 'Trending' }}
          value={filters.sort}
          onChange={(sort) => setFilters({ ...filters, sort })}
          onPreload={(sort) => prefetch('profiles', { ...filters, sort })}
        />
      </FilterBar>
      <AuthorsGrid profiles={profiles} loading={isLoading} />
      {profiles.length === 0 && <p>No authors found</p>}
    </Pagination>
  )
}

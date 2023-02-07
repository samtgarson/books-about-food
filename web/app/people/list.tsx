'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  FetchProfilesOutput
} from 'src/services/profiles/fetch-profiles'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { ProfileItem } from 'src/components/profiles/item'
import { PeopleFilters } from './filters'
import { GridContainer } from 'src/components/lists/grid-container'
import cn from 'classnames'

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
      <GridContainer
        className={cn('transition-opacity', isLoading && 'opacity-50')}
      >
        {profiles.map((profile) => (
          <ProfileItem key={profile.id} profile={profile} />
        ))}
      </GridContainer>
      {profiles.length === 0 && <p>No profiles found</p>}
    </Pagination>
  )
}

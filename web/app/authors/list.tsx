'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import {
  FetchProfilesInput,
  FetchProfilesOutput
} from 'src/services/profiles/fetch-profiles'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { AuthorItem } from './item'
import { Container } from 'src/components/atoms/container'
import cn from 'classnames'

export type AuthorListProps = {
  fallback?: FetchProfilesOutput
}

export const AuthorsList: FC<AuthorListProps> = ({
  fallback: fallbackData
}) => {
  const [filters, setFilters] = useState<FetchProfilesInput>({
    onlyAuthors: true
  })
  const { data, isLoading } = useFetcher('profiles', filters, { fallbackData })
  if (!data) return null
  const { profiles, filteredTotal, total, perPage } = data

  return (
    <Container>
      <Pagination
        total={total}
        perPage={perPage}
        page={filters.page ?? 0}
        filteredTotal={filteredTotal}
        onChange={(page) => setFilters({ ...filters, page })}
        onPreload={(page) => prefetch('profiles', { ...filters, page })}
      >
        <ul
          className={cn(
            'grid auto-grid-md gap-x-8 gap-y-16 transition-opacity',
            isLoading && 'opacity-50'
          )}
        >
          {profiles.map((profile) => (
            <AuthorItem key={profile.id} profile={profile} />
          ))}
        </ul>
        {profiles.length === 0 && <p>No authors found</p>}
      </Pagination>
    </Container>
  )
}

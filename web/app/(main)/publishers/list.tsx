'use client'

import { FC, useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { PublishersItem } from './item'
import { FetchPublishersInput } from 'src/services/publishers/fetch-publishers'
import cn from 'classnames'
import { FilterBar } from 'src/components/lists/filter-bar'

export type PublishersListProps = {
  fallback?: FetchPublishersInput
}

export const PublishersList: FC<PublishersListProps> = ({
  fallback: fallbackData
}) => {
  const [filters, setFilters] = useState<FetchPublishersInput>()
  const { data, isLoading } = useFetcher('publishers', filters, {
    fallbackData
  })
  if (!data) return null
  const { publishers, filteredTotal, total, perPage } = data

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters?.page ?? 0}
      filteredTotal={filteredTotal}
      onChange={(page) => setFilters({ ...filters, page })}
      onPreload={(page) => prefetch('publishers', { ...filters, page })}
    >
      <FilterBar
        label="Show"
        search={{
          value: filters?.search,
          onChange: (search) => setFilters({ ...filters, page: 0, search })
        }}
      />
      <ul
        className={cn(
          'grid auto-grid-lg transition-opacity',
          isLoading && 'opacity-50'
        )}
      >
        {publishers.map((profile) => (
          <PublishersItem key={profile.id} publisher={profile} />
        ))}
      </ul>
      {publishers.length === 0 && <p>No publishers found</p>}
    </Pagination>
  )
}

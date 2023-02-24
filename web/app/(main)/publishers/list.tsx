'use client'

import { FC, useState } from 'react'
import { FilterBar } from 'src/components/lists/filter-bar'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { FetchPublishersInput } from 'src/services/publishers/fetch-publishers'
import { PublisherGrid } from './grid'

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
        title="Publishers"
        search={{
          value: filters?.search,
          onChange: (search) => setFilters({ ...filters, page: 0, search })
        }}
      />
      <PublisherGrid publishers={publishers} loading={isLoading} />
      {publishers.length === 0 && <p>No publishers found</p>}
    </Pagination>
  )
}

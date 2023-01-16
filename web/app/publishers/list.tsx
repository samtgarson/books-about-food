'use client'

import { useState } from 'react'
import { Pagination } from 'src/components/lists/pagination'
import { prefetch, useFetcher } from 'src/contexts/fetcher'
import { PublishersItem } from './item'
import { FetchPublishersInput } from 'src/services/publishers/fetch-publishers'
import { Search } from 'src/components/lists/search'

export const PublishersList = () => {
  const [filters, setFilters] = useState<FetchPublishersInput>()
  const { data } = useFetcher('publishers', filters)
  if (!data) return null
  const { publishers, filteredTotal, total, perPage } = data

  return (
    <>
      <Search
        value={filters?.search}
        onChange={(search) => setFilters({ ...filters, page: 0, search })}
      />
      <ul className="flex flex-wrap gap-4">
        {publishers.map((profile) => (
          <PublishersItem key={profile.id} publisher={profile} />
        ))}
      </ul>
      {publishers.length === 0 && <p>No publishers found</p>}
      <Pagination
        total={total}
        perPage={perPage}
        page={filters?.page ?? 0}
        filteredTotal={filteredTotal}
        onChange={(page) => setFilters({ ...filters, page })}
        onPreload={(page) => prefetch('publishers', { ...filters, page })}
      />
    </>
  )
}

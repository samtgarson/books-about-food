import { Pagination } from 'src/components/lists/pagination'
import {
  FetchPublishersInput,
  fetchPublishers
} from 'src/services/publishers/fetch-publishers'
import { PublisherGrid } from './grid'

export type PublishersListProps = {
  filters: FetchPublishersInput
}

export async function PublishersList({ filters = {} }: PublishersListProps) {
  const { data } = await fetchPublishers.call(filters)
  if (!data) return null
  const { publishers, filteredTotal, total, perPage } = data

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters?.page ?? 0}
      filteredTotal={filteredTotal}
    >
      <PublisherGrid publishers={publishers} />
      {publishers.length === 0 && <p>No publishers found</p>}
    </Pagination>
  )
}
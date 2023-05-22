import { FilterBar } from 'src/components/lists/filter-bar'
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
  const { publishers, filteredTotal, total, perPage } =
    await fetchPublishers.call(filters)

  return (
    <Pagination
      total={total}
      perPage={perPage}
      page={filters?.page ?? 0}
      filteredTotal={filteredTotal}
    >
      <FilterBar
        title="Publishers"
        search={{
          value: filters?.search
        }}
      />
      <PublisherGrid publishers={publishers} />
      {publishers.length === 0 && <p>No publishers found</p>}
    </Pagination>
  )
}

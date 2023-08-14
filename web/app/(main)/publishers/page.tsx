import { createIndexPage } from 'src/components/pages/index-page'
import {
  FetchPublishersInput,
  fetchPublishers
} from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'
import { FilterBar } from 'src/components/lists/filter-bar'

export const dynamic = 'force-dynamic'

const filters = ({ filters = {} }: { filters?: FetchPublishersInput }) => (
  <FilterBar
    title="Publishers"
    search={{
      value: filters?.search
    }}
  />
)

export default createIndexPage({
  content: PublishersList,
  svc: fetchPublishers,
  filters
})

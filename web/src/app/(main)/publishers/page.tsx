import { Metadata } from 'next'
import { FilterBar } from 'src/components/lists/filter-bar'
import { createIndexPage } from 'src/components/pages/index-page'
import {
  FetchPublishersInput,
  fetchPublishers
} from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export const metadata: Metadata = {
  title: 'Publishers'
}

export * from 'app/default-static-config'

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
  schema: fetchPublishers.input,
  filters
})
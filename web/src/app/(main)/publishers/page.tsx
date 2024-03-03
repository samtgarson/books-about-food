import {
  FetchPublishersInput,
  fetchPublishers
} from '@books-about-food/core/services/publishers/fetch-publishers'
import { Metadata } from 'next'
import { FilterBar } from 'src/components/lists/filter-bar'
import { createIndexPage } from 'src/components/pages/index-page'
import { PublishersList } from './list'

export const metadata: Metadata = {
  title: 'Publishers',
  alternates: {
    canonical: '/publishers'
  }
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

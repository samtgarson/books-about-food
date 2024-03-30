import {
  FetchPublishersInput,
  fetchPublishers
} from '@books-about-food/core/services/publishers/fetch-publishers'
import { FilterBar } from 'src/components/lists/filter-bar'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { PublishersList } from './list'

export const generateMetadata = indexPageMetadata({
  title: 'Publishers',
  service: fetchPublishers,
  collection: 'cookbook publishers',
  path: '/publishers',
  image: true
})

export const revalidate = 3600

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

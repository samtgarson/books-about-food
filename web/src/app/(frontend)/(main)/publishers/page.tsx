import { FilterBar } from 'src/components/lists/filter-bar'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import {
  FetchPublishersInput,
  fetchPublishers
} from 'src/core/services/publishers/fetch-publishers'
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
  components: {
    content: PublishersList,
    filters
  },
  schema: fetchPublishers.input
})

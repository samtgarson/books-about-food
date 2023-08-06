import { createIndexPage } from 'src/components/pages/index-page'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import { PublishersList } from './list'

export const dynamic = 'force-dynamic'

export default createIndexPage({
  content: PublishersList,
  svc: fetchPublishers
})

import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { fetchCollections } from 'src/core/services/collections/fetch-collections'
import { CollectionsGrid, CollectionsSkeletonGrid } from './grid'

export const generateMetadata = indexPageMetadata({
  title: 'Collections',
  service: fetchCollections,
  collection: 'curated collections of cookbooks',
  path: '/collections',
  image: true
})

export const revalidate = 3600

export default createIndexPage({
  components: {
    content: CollectionsGrid,
    loading: CollectionsSkeletonGrid
  },
  schema: fetchCollections.input
})

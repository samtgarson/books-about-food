import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'
import { AuthorsList } from './list'

export const generateMetadata = indexPageMetadata({
  title: 'Authors',
  service: fetchProfiles,
  collection: 'cookbook authors',
  path: '/authors',
  image: true,
  extraParams: { onlyAuthors: true }
})

export const revalidate = 3600

export default createIndexPage({
  components: {
    content: AuthorsList,
    loading: SkeletonAuthorsGrid,
    filters: AuthorFilters
  },
  schema: fetchProfiles.input
})

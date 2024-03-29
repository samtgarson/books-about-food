import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'
import { AuthorsList } from './list'

export const generateMetadata = indexPageMetadata({
  title: 'Authors',
  service: fetchProfiles,
  path: '/authors'
})

export const revalidate = 3600

export default createIndexPage({
  content: AuthorsList,
  schema: fetchProfiles.input,
  loading: SkeletonAuthorsGrid,
  filters: AuthorFilters
})

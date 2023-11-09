import { fetchProfiles } from 'core/services/profiles/fetch-profiles'
import { Metadata } from 'next'
import { createIndexPage } from 'src/components/pages/index-page'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'
import { AuthorsList } from './list'

export const metadata: Metadata = {
  title: 'Authors'
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: AuthorsList,
  schema: fetchProfiles.input,
  loading: SkeletonAuthorsGrid,
  filters: AuthorFilters
})

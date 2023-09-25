import { Metadata } from 'next'
import { createIndexPage } from 'src/components/pages/index-page'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'
import { AuthorsList } from './list'

export const metadata: Metadata = {
  title: 'Authors'
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: AuthorsList,
  svc: fetchProfiles,
  loading: SkeletonAuthorsGrid,
  filters: AuthorFilters
})

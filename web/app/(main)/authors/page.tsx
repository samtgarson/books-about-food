import { createIndexPage } from 'src/components/pages/index-page'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'

export * from 'app/default-static-config'

export default createIndexPage({
  content: AuthorsList,
  svc: fetchProfiles,
  loading: SkeletonAuthorsGrid,
  filters: AuthorFilters
})

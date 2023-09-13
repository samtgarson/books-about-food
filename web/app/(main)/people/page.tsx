import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleList } from './list'
import { createIndexPage } from 'src/components/pages/index-page'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'

export * from 'app/default-static-config'

export default createIndexPage({
  content: PeopleList,
  svc: fetchProfiles,
  loading: SkeletonPeopleGrid,
  filters: PeopleFilters
})

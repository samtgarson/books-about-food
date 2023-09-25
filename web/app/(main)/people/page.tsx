import { Metadata } from 'next'
import { createIndexPage } from 'src/components/pages/index-page'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'
import { PeopleList } from './list'

export const metadata: Metadata = {
  title: 'People'
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: PeopleList,
  svc: fetchProfiles,
  loading: SkeletonPeopleGrid,
  filters: PeopleFilters
})

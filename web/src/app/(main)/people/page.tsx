import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { Metadata } from 'next'
import { createIndexPage } from 'src/components/pages/index-page'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'
import { PeopleList } from './list'

export const metadata: Metadata = {
  title: 'People',
  alternates: {
    canonical: '/people'
  }
}

export * from 'app/default-static-config'

export default createIndexPage({
  content: PeopleList,
  schema: fetchProfiles.input,
  loading: SkeletonPeopleGrid,
  filters: PeopleFilters
})

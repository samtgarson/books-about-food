import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'
import { PeopleList } from './list'

export const generateMetadata = indexPageMetadata({
  title: 'People',
  service: fetchProfiles,
  collection: "people who've worked on cookbooks",
  path: '/people',
  image: true
})

export const revalidate = 3600

export default createIndexPage({
  content: PeopleList,
  schema: fetchProfiles.input,
  loading: SkeletonPeopleGrid,
  filters: PeopleFilters
})

import { createIndexPage } from 'src/components/pages/index-page'
import { indexPageMetadata } from 'src/components/pages/index-page-metadata'
import { fetchProfiles } from 'src/core/services/profiles/fetch-profiles'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'
import { PeopleList } from './list'

export const generateMetadata = indexPageMetadata({
  title: 'People Directory',
  service: fetchProfiles,
  collection: "people who've worked on cookbooks",
  path: '/people',
  image: true
})

export const revalidate = 3600

export default createIndexPage({
  components: {
    content: PeopleList,
    loading: SkeletonPeopleGrid,
    filters: PeopleFilters
  },
  schema: fetchProfiles.input
})

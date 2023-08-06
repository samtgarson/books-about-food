import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleList } from './list'
import Loading from './loading'
import { createIndexPage } from 'src/components/pages/index-page'

export default createIndexPage({
  content: PeopleList,
  svc: fetchProfiles,
  loading: <Loading />
})

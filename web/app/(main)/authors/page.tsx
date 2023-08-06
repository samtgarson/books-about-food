import { createIndexPage } from 'src/components/pages/index-page'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'
import Loading from './loading'

export const dynamic = 'force-dynamic'

export default createIndexPage({
  content: AuthorsList,
  svc: fetchProfiles,
  loading: <Loading />
})

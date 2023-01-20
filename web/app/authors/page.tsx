import { PageTitle } from 'src/components/atoms/page-title'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'

export default async () => {
  const data = await fetchProfiles.call({ onlyAuthors: true })

  return (
    <>
      <PageTitle>Authors</PageTitle>
      <AuthorsList fallback={data} data-superjson />
    </>
  )
}

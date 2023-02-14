import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'

export * from 'app/default-static-config'

export default async () => {
  const data = await fetchProfiles.call({ onlyAuthors: true, sort: 'trending' })

  return (
    <Container>
      <PageTitle>Authors</PageTitle>
      <AuthorsList fallback={data} data-superjson />
    </Container>
  )
}

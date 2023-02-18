import { Container } from 'src/components/atoms/container'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'

export * from 'app/default-static-config'

export default async () => {
  const data = await fetchProfiles.call({ onlyAuthors: true, sort: 'trending' })

  return (
    <Container>
      <AuthorsList fallback={data} data-superjson />
    </Container>
  )
}

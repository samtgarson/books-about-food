import { Container } from 'src/components/atoms/container'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'

export * from 'app/default-static-config'

export default async ({ searchParams }) => {
  const filters = fetchProfiles.input.parse(searchParams)

  return (
    <Container belowNav>
      <AuthorsList filters={filters} />
    </Container>
  )
}

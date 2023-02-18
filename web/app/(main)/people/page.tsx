import { Container } from 'src/components/atoms/container'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleList } from './list'

export * from 'app/default-static-config'

export default async () => {
  const data = await fetchProfiles.call({ onlyAuthors: false })

  return (
    <>
      <Container>
        <PeopleList fallback={data} data-superjson />
      </Container>
    </>
  )
}

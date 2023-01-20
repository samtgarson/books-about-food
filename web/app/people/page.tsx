import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleList } from './list'

export default async () => {
  const data = await fetchProfiles.call({ onlyAuthors: false })

  return (
    <>
      <PageTitle>People</PageTitle>
      <Container>
        <PeopleList fallback={data} data-superjson />
      </Container>
    </>
  )
}

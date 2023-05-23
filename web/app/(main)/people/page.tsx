import { Container } from 'src/components/atoms/container'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { PeopleList } from './list'
import { PageProps } from 'src/components/types'

export * from 'app/default-static-config'

export default async ({ searchParams }: PageProps) => {
  const filters = fetchProfiles.input.parse(searchParams)

  return (
    <>
      <Container belowNav>
        {/* @ts-expect-error RSC */}
        <PeopleList filters={filters} />
      </Container>
    </>
  )
}

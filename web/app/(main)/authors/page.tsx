import { Container } from 'src/components/atoms/container'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { AuthorsList } from './list'
import { PageProps } from 'src/components/types'

export const dynamic = 'force-dynamic'

export default async ({ searchParams }: PageProps) => {
  const filters = fetchProfiles.input.parse(searchParams)

  return (
    <Container belowNav>
      {/* @ts-expect-error RSC */}
      <AuthorsList filters={filters} />
    </Container>
  )
}

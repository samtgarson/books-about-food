import { Container } from 'src/components/atoms/container'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'
import { AuthorFilters } from './filters'
import { SkeletonAuthorsGrid } from './grid'

export default async ({ filters = {} }: { filters?: FetchProfilesInput }) => {
  return (
    <Container belowNav>
      <AuthorFilters filters={filters} />
      <SkeletonAuthorsGrid />
    </Container>
  )
}

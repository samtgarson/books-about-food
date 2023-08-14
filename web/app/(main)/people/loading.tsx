import { Container } from 'src/components/atoms/container'
import { FetchProfilesInput } from 'src/services/profiles/fetch-profiles'
import { PeopleFilters } from './filters'
import { SkeletonPeopleGrid } from './grid'

export default async ({ filters = {} }: { filters?: FetchProfilesInput }) => {
  return (
    <Container belowNav>
      <PeopleFilters filters={filters} />
      <SkeletonPeopleGrid />
    </Container>
  )
}

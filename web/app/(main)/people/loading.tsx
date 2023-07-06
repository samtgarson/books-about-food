import { Container } from 'src/components/atoms/container'
import { PeopleFilters } from './filters'
import { GridContainer } from 'src/components/lists/grid-container'
import { ProfileItem } from 'src/components/profiles/item'

export default async () => {
  return (
    <>
      <Container belowNav>
        <PeopleFilters filters={{}} />
        <GridContainer>
          {Array.from({ length: 30 }, (_, i) => (
            <ProfileItem key={i} index={i} />
          ))}
        </GridContainer>
      </Container>
    </>
  )
}

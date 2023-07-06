import { Container } from 'src/components/atoms/container'
import { AuthorFilters } from './filters'
import { AuthorGridContainer } from './grid'
import { AuthorItem } from './item'

export default async () => {
  return (
    <Container belowNav>
      <AuthorFilters filters={{}} />
      <AuthorGridContainer>
        {Array.from({ length: 30 }, (_, i) => (
          <AuthorItem key={i} index={i} />
        ))}
      </AuthorGridContainer>
    </Container>
  )
}

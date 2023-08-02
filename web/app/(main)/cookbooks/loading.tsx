import { Container } from 'src/components/atoms/container'
import { BookFilters } from 'src/components/books/filters'
import { Skeleton } from 'src/components/books/item'
import { GridContainer } from 'src/components/lists/grid-container'
import cn from 'classnames'

export * from 'app/default-static-config'

export default async () => {
  return (
    <>
      <Container belowNav>
        <BookFilters filters={{}} />
        <GridContainer className={cn('sm:gap-y-16')}>
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} index={i} />
          ))}
        </GridContainer>
      </Container>
    </>
  )
}
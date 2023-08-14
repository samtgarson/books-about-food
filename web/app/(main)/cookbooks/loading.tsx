import { Container } from 'src/components/atoms/container'
import { BookFilters } from 'src/components/books/filters'
import { SkeletonBookList } from 'src/components/books/list'
import { FetchBooksInput } from 'src/services/books/fetch-books'

export * from 'app/default-static-config'

export default async ({ filters = {} }: { filters?: FetchBooksInput } = {}) => {
  return (
    <>
      <Container belowNav>
        <BookFilters filters={filters} />
        <SkeletonBookList />
      </Container>
    </>
  )
}

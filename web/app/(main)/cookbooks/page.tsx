import { Container } from 'src/components/atoms/container'
import { BookList } from 'src/components/books/list'
import { fetchBooks } from 'src/services/books/fetch-books'

export * from 'app/default-static-config'

export default async ({ searchParams }) => {
  const filters = fetchBooks.input.parse(searchParams)
  return (
    <>
      <Container belowNav>
        <BookList filters={filters} />
      </Container>
    </>
  )
}

import { Container } from 'src/components/atoms/container'
import { BookList } from 'src/components/books/list'
import { fetchBooks } from 'src/services/books/fetch-books'

export * from 'app/default-static-config'

export default async () => {
  const books = await fetchBooks.call()

  return (
    <>
      <Container belowNav>
        <BookList fallback={books} data-superjson />
      </Container>
    </>
  )
}

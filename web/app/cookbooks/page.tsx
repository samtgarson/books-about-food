import { PageTitle } from 'src/components/atoms/page-title'
import { Container } from 'src/components/atoms/container'
import { BookList } from 'src/components/books/list'
import { fetchBooks } from 'src/services/books/fetch-books'

export default async () => {
  const books = await fetchBooks.call()

  return (
    <>
      <PageTitle>Cookbooks</PageTitle>
      <Container>
        <BookList fallback={books} data-superjson />
      </Container>
    </>
  )
}

import { Container } from 'src/components/atoms/container'
import { BookList } from 'src/components/books/list'
import { PageProps } from 'src/components/types'
import { fetchBooks } from 'src/services/books/fetch-books'

export * from 'app/default-static-config'

export default async ({ searchParams }: PageProps) => {
  const filters = fetchBooks.input.parse(searchParams)
  return (
    <>
      <Container belowNav>
        {/* @ts-expect-error RSC */}
        <BookList filters={filters} />
      </Container>
    </>
  )
}

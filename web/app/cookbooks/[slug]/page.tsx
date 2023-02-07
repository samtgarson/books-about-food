import { notFound } from 'next/navigation'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchBooks } from 'src/services/books/fetch-books'

export * from 'app/default-static-config'

export const generateStaticParams = async () => {
  const { books } = await fetchBooks.call({ perPage: 0 })

  return books.map((book) => ({
    slug: book.slug
  }))
}

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug })
  if (!book) notFound()

  return (
    <Container className="mt-8 sm:mt-20" key="header">
      <h1 className="font-style-title flex items-center">{book.title}</h1>
      {book.subtitle && <Detail>{book.subtitle}</Detail>}
      <ProfileListSection
        data-superjson
        profiles={book.authors}
        title={book.authors.length > 1 ? 'Authors' : 'Author'}
      />
    </Container>
  )
}

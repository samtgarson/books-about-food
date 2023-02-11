import { notFound } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { CoverCarousel } from 'src/components/books/cover-carousel'
import { BookLinks } from 'src/components/books/links'
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
    <div className="lg:pr-[50vw] relative">
      <Container className="pt-6 sm:pt-20" key="header">
        <h1 className="font-style-title flex items-center mb-6 sm:mb-4">
          {book.title}
        </h1>
        {book.subtitle && (
          <p className="md:mb-8 py-4 border-y border-black">{book.subtitle}</p>
        )}
        <AntiContainer>
          <CoverCarousel
            book={book}
            className="lg:absolute lg:w-[50vw] lg:inset-y-0 lg:right-0"
          />
        </AntiContainer>
        <AntiContainer desktop={false}>
          <Container
            desktop={false}
            className="pt-4 md:pt-0 mb-4 sm:mb-8 border-t border-black sm:border-t-0"
          >
            <ProfileListSection
              data-superjson
              profiles={book.authors}
              title={book.authors.length > 1 ? 'Authors' : 'Author'}
            />
          </Container>
          <Container
            desktop={false}
            className="pt-4 md:pt-0 mb-4 sm:mb-8 border-t border-black sm:border-t-0"
          >
            <ProfileListSection
              data-superjson
              profiles={book.team}
              title="Team"
            />
          </Container>
          {book.links.length > 0 && (
            <Container
              desktop={false}
              className="mb-4 py-4 sm:mb-8 border-t border-black"
            >
              <BookLinks links={book.links} />
            </Container>
          )}
        </AntiContainer>
      </Container>
    </div>
  )
}

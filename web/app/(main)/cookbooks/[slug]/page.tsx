import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { CoverCarousel } from 'src/components/books/cover-carousel'
import { BookLinks } from 'src/components/books/links'
import { TagList } from 'src/components/books/tag-list'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchBooks } from 'src/services/books/fetch-books'
import cn from 'classnames'
import { CorrectionButton } from 'src/components/books/correction-button'
import { BookOverflow } from 'src/components/books/book-overflow'
import { TeamList } from 'src/components/books/team-list'

export * from 'app/default-static-config'

export const generateStaticParams = async () => {
  const { books } = await fetchBooks.call({ perPage: 0, sort: 'releaseDate' })

  return books.map((book) => ({
    slug: book.slug
  }))
}

export default async ({ params: { slug } }: { params: { slug: string } }) => {
  const book = await fetchBook.call({ slug })
  if (!book) notFound()

  return (
    <div className="lg:pr-[50vw] relative flex-grow">
      <Container className="pt-6 sm:pt-20" key="header" belowNav>
        <div className="font-style-title flex items-center mb-6 sm:mb-4">
          <h1>{book.title}</h1>
          <BookOverflow book={book} className="ml-auto" />
        </div>
        {book.subtitle && <Detail className="md:mb-8">{book.subtitle}</Detail>}
        <AntiContainer className="border-t border-black sm:border-t-0">
          <div className="lg:absolute lg:w-[50vw] lg:top-0 lg:-bottom-20 lg:right-0 flex flex-col">
            <CoverCarousel
              data-superjson
              book={book}
              className="lg:sticky lg:top-0 lg:-mt-16 lg:pt-16 lg:h-full lg:max-h-screen lg:flex lg:items-stretch"
            />
          </div>
        </AntiContainer>
        <AntiContainer desktop={false}>
          {book.authors.length > 0 && (
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
          )}
          <Container
            desktop={false}
            className="pt-4 md:pt-0 mb-4 sm:mb-0 border-t border-black sm:border-t-0"
          >
            {book.team.length > 0 && (
              <TeamList
                data-superjson
                contributions={book.contributions}
                className="mb-8"
              />
            )}
            <CorrectionButton book={book} className="" />
          </Container>
          <Container
            desktop={false}
            className={cn('flex gap-x-4 flex-wrap sm:pt-16')}
          >
            <BookLinks
              links={book.links}
              className="w-full mb-4 order-last sm:order-first pt-4 sm:pt-0 sm:mb-16"
            />
            {book.publisher && (
              <Detail column>
                <p>Publisher</p>
                <p className="font-medium">
                  <Link href={`/publishers/${book.publisher.slug}`}>
                    {book.publisher.name}
                  </Link>
                </p>
              </Detail>
            )}
            {book.releaseDate && (
              <Detail column>
                <p>Release Date</p>
                <p>{book.formattedReleaseDate}</p>
              </Detail>
            )}
            {book.tags.length > 0 && (
              <Detail column>
                <p>Tags</p>
                <TagList tags={book.tags} />
              </Detail>
            )}
            {book.pages && (
              <Detail column>
                <p>No. of Pages</p>
                <p>{book.pages}</p>
              </Detail>
            )}
          </Container>
        </AntiContainer>
      </Container>
    </div>
  )
}

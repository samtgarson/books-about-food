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
import { MoreHorizontal } from 'react-feather'
import { CorrectionButton } from 'src/components/books/correction-button'

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
          <MoreHorizontal className="ml-auto" strokeWidth={1} />
        </h1>
        {book.subtitle && <Detail className="md:mb-8">{book.subtitle}</Detail>}
        <AntiContainer className="border-t border-black sm:border-t-0">
          <div className="lg:absolute lg:w-[50vw] lg:inset-y-0 lg:right-0 flex flex-col lg:h-full">
            <CoverCarousel
              data-superjson
              book={book}
              className="lg:sticky lg:top-0 lg:-mt-32 lg:h-full lg:max-h-screen lg:flex lg:items-stretch"
            />
          </div>
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
            className="pt-4 md:pt-0 mb-4 sm:mb-0 border-t border-black sm:border-t-0"
          >
            {book.team.length > 0 && (
              <ProfileListSection
                data-superjson
                profiles={book.team}
                title="Team"
                className="mb-8"
              />
            )}
            <CorrectionButton book={book} className="" />
          </Container>
          <Container
            desktop={false}
            className={cn('mb-4 sm:mb-8 flex gap-x-4 flex-wrap sm:pt-16')}
          >
            <BookLinks
              links={book.links}
              className="w-full mb-4 order-last sm:order-first pt-4 sm:pt-0 sm:mb-16"
            />
            <Detail column>
              <p>Publisher</p>
              <p className="font-medium">
                <Link href={book.publisher.url}>{book.publisher.name}</Link>
              </p>
            </Detail>
            <Detail column>
              <p>Release Date</p>
              <p>{book.formattedReleaseDate}</p>
            </Detail>
            {book.tags.length > 0 && (
              <Detail column>
                <p>Tags</p>
                <TagList tags={book.tags} />
              </Detail>
            )}
            <Detail column>
              <p>No. of Pages</p>
              <p>{book.pages}</p>
            </Detail>
          </Container>
        </AntiContainer>
      </Container>
    </div>
  )
}

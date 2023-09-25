import cn from 'classnames'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { BookOverflow } from 'src/components/books/book-overflow'
import { CorrectionButton } from 'src/components/books/correction-button'
import { CoverCarousel } from 'src/components/books/cover-carousel'
import { BookLinks } from 'src/components/books/links'
import { SimilarBooks } from 'src/components/books/similar-books'
import { TagList } from 'src/components/books/tag-list'
import { TeamList } from 'src/components/books/team-list'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { PageProps } from 'src/components/types'
import { fetchBook } from 'src/services/books/fetch-book'

type CookbooksPageProps = PageProps<{ slug: string }>

export async function generateMetadata({
  params: { slug }
}: CookbooksPageProps): Promise<Metadata> {
  const book = await fetchBook.call({ slug })
  if (!book) notFound()

  return { title: book.title }
}

export * from 'app/default-static-config'

export default async ({ params: { slug } }: CookbooksPageProps) => {
  const book = await fetchBook.call({ slug })
  if (!book) notFound()

  return (
    <div className="relative flex-grow lg:pr-[50vw]">
      <Container className="pt-6 sm:pt-20" key="header" belowNav>
        <div className="font-style-title mb-6 flex items-center sm:mb-4">
          <h1>{book.title}</h1>
          <BookOverflow book={book} className="ml-auto" data-superjson />
        </div>
        {book.subtitle && <Detail className="md:mb-8">{book.subtitle}</Detail>}
        <AntiContainer className="border-t border-black sm:border-t-0">
          <div className="flex flex-col lg:absolute lg:-bottom-20 lg:right-0 lg:top-0 lg:w-[50vw]">
            <CoverCarousel
              data-superjson
              book={book}
              className="lg:sticky lg:top-0 lg:-mt-16 lg:flex lg:h-full lg:max-h-screen lg:items-stretch lg:pt-16"
            />
          </div>
        </AntiContainer>
        <AntiContainer desktop={false}>
          {book.authors.length > 0 && (
            <Container
              desktop={false}
              className="mb-6 border-t border-black pt-6 sm:mb-8 sm:border-t-0 md:pt-0"
            >
              <ProfileListSection
                profiles={book.authors}
                title={book.authors.length > 1 ? 'Authors' : 'Author'}
                hideMeta
              />
            </Container>
          )}
          <Container
            desktop={false}
            className="mb-6 border-t border-black pt-6 sm:mb-0 sm:border-t-0 md:pt-0"
          >
            {book.team.length > 0 && (
              <TeamList contributions={book.contributions} className="mb-8" />
            )}
            <CorrectionButton book={book} className="" />
          </Container>
          <Container
            desktop={false}
            className={cn('flex flex-wrap gap-x-4 sm:pt-16')}
          >
            <BookLinks
              links={book.links}
              className="order-last mb-4 w-full pt-4 sm:order-first sm:mb-16 sm:pt-0"
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
        <SimilarBooks slug={book.slug} className="pt-8 sm:pt-16" />
      </Container>
    </div>
  )
}

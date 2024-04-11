import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import {
  fetchComingSoon,
  fetchNewlyAdded
} from '@books-about-food/core/services/home/fetch'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { toColorString } from '@books-about-food/shared/utils/types'
import cn from 'classnames'
import { Metadata, ResolvedMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { Pill } from 'src/components/atoms/pill'
import { BookOverflow } from 'src/components/books/book-overflow'
import { CorrectionButton } from 'src/components/books/correction-button'
import { CoverCarousel } from 'src/components/books/cover-carousel'
import { BookLinks } from 'src/components/books/links'
import { SimilarBooks } from 'src/components/books/similar-books'
import { TagList } from 'src/components/books/tag-list'
import { TeamList } from 'src/components/books/team-list'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { PageProps } from 'src/components/types'
import { bookTotal, genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'

export type CookbooksPageProps = PageProps<{ slug: string }>

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export async function generateStaticParams() {
  const [{ data }, newlyAdded, comingSoon] = await Promise.all([
    call(fetchBooks),
    fetchNewlyAdded(),
    fetchComingSoon()
  ])

  return (
    [...(data?.books ?? []), ...newlyAdded, ...comingSoon].map((book) => ({
      slug: book.slug
    })) ?? []
  )
}

export default async ({ params: { slug } }: CookbooksPageProps) => {
  const { data: book } = await call(fetchBook, { slug, onlyPublished: true })
  if (!book) notFound()

  return (
    <div className="relative flex-grow lg:pr-[50vw] flex flex-col sm:gap-y-16">
      <Container className="flex flex-col md:gap-8" key="header" belowNav>
        <div className="pt-6 sm:pt-20 flex flex-col gap-4">
          <div
            className={cn(
              'font-style-title flex items-center',
              !book.subtitle && 'mb-4 sm:mb-8'
            )}
          >
            <h1>{book.title}</h1>
            <BookOverflow book={book} className="ml-auto" data-superjson />
          </div>
          {book.subtitle && <Detail>{book.subtitle}</Detail>}
        </div>
        <AntiContainer className="border-t border-black sm:border-t-0 md:-mt-8">
          <div className="flex flex-col lg:absolute lg:-bottom-20 lg:right-0 lg:top-0 lg:w-[50vw]">
            <CoverCarousel
              data-superjson
              book={book}
              className="lg:sticky lg:top-0 lg:-mt-16 lg:flex lg:h-full lg:max-h-screen lg:items-stretch lg:pt-16"
            />
          </div>
        </AntiContainer>
        <AntiContainer desktop={false} className="flex flex-col md:gap-8">
          {book.authors.length > 0 && (
            <Container
              desktop={false}
              className="border-t border-black py-4 sm:border-t-0 md:py-0"
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
            className="border-y border-black py-4 sm:border-y-0 md:py-0"
          >
            {book.team.length > 0 && (
              <TeamList contributions={book.contributions} className="mb-8" />
            )}
            <CorrectionButton book={book} data-superjson />
          </Container>
        </AntiContainer>
      </Container>
      <Container className="mobile-only:my-8">
        <BookLinks
          links={book.links}
          className="order-last w-full sm:order-first"
        />
      </Container>
      <Container
        className={cn(
          'flex flex-wrap gap-x-4',
          !book.links.length && 'mobile-only:-mt-px'
        )}
      >
        {book.publisher && (
          <Detail className="flex flex-col gap-2 items-start" column>
            <p className="all-caps">Publisher</p>
            <Link href={`/publishers/${book.publisher.slug}`}>
              <Pill variant="filled" small>
                {book.publisher.name}
              </Pill>
            </Link>
          </Detail>
        )}
        {book.releaseDate && (
          <Detail className="flex flex-col gap-2" column>
            <p className="all-caps">Release Date</p>
            <p>{book.formattedReleaseDate}</p>
          </Detail>
        )}
        {book.tags.length > 0 && (
          <Detail className="flex flex-col gap-2" column>
            <p className="all-caps">Tags</p>
            <TagList tags={book.tags} />
          </Detail>
        )}
        {book.pages && (
          <Detail className="flex flex-col gap-2" column>
            <p className="all-caps">No. of Pages</p>
            <p>{book.pages}</p>
          </Detail>
        )}
        {!!book.colors?.length && (
          <Detail className="flex flex-col gap-2" column>
            <p className="all-caps">Colours</p>
            <div className="flex flex-wrap gap-2">
              {book.colors.map((color) => (
                <Link
                  key={toColorString(color)}
                  href={`/cookbooks?color=${[
                    Math.round(color.h),
                    Math.round(color.s),
                    Math.round(color.l)
                  ].join(',')}`}
                  className="size-6 rounded-full"
                  style={{
                    backgroundColor: toColorString(color)
                  }}
                />
              ))}
            </div>
          </Detail>
        )}
      </Container>
      <Container className="mobile-only:mt-8">
        <Suspense>
          <SimilarBooks slug={book.slug} />
        </Suspense>
      </Container>
    </div>
  )
}

export async function generateMetadata(
  { params: { slug } }: CookbooksPageProps,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const [{ data: book }, count = 0] = await Promise.all([
    call(fetchBook, { slug, onlyPublished: true }),
    bookTotal
  ])
  if (!book) notFound()

  return genMetadata(`/cookbooks/${book.slug}`, await parent, {
    title: book.title,
    description: `View the ${book.title} cookbook and ${
      count - 1
    } other curated cookbooks on Books About Food — the cookbook industry’s new digital home.`,
    openGraph: {
      type: 'book',
      releaseDate: book.isoReleaseDate,
      tags: ['Cookbook', ...book.tagNames],
      authors: book.authors.map((author) => appUrl(`/authors/${author.slug}`)),
      images: [
        {
          url: `/cookbooks/${book.slug}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${book.title} on Books About Food`
        }
      ]
    }
  })
}

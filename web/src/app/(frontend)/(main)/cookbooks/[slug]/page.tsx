import { appUrl } from '@books-about-food/shared/utils/app-url'
import { toColorString } from '@books-about-food/shared/utils/types'
import cn from 'classnames'
import { Metadata, ResolvedMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { AntiContainer, Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { MaxHeight } from 'src/components/atoms/max-height'
import { Pill } from 'src/components/atoms/pill'
import { BookOverflow } from 'src/components/books/book-overflow'
import { CorrectionButton } from 'src/components/books/correction-button'
import { CoverCarousel } from 'src/components/books/cover-carousel'
import { DesignCommentary } from 'src/components/books/design-commentary'
import { BookLinks } from 'src/components/books/links'
import { SimilarBooks } from 'src/components/books/similar-books'
import { TagList } from 'src/components/books/tag-list'
import { TeamList } from 'src/components/books/team-list'
import { ProfileListSection } from 'src/components/profiles/list-section'
import { slugPage } from 'src/components/types'
import { Wrap } from 'src/components/utils/wrap'
import { fetchBook } from 'src/core/services/books/fetch-book'
import { fetchBooks } from 'src/core/services/books/fetch-books'
import { fetchComingSoon, fetchNewlyAdded } from 'src/core/services/home/fetch'
import { getPayloadClient } from 'src/core/services/utils/payload'
import { bookTotal, genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const [{ data }, newlyAdded, comingSoon] = await Promise.all([
    call(fetchBooks, undefined),
    fetchNewlyAdded(payload),
    fetchComingSoon(payload)
  ])

  return (
    [...(data?.books ?? []), ...newlyAdded, ...comingSoon].map((book) => ({
      slug: book.slug
    })) ?? []
  )
}

export default slugPage<'/cookbooks/[slug]'>(async function CookbookPage(slug) {
  const { data: book } = await call(fetchBook, { slug, onlyPublished: true })
  if (!book) notFound()

  return (
    <div className="relative flex grow flex-col sm:gap-y-20 lg:pr-[50vw]">
      <Container className="flex flex-col sm:gap-8" key="header" belowNav>
        <div className="flex flex-col gap-4 pt-6 md:pt-20">
          <div
            className={cn(
              'flex items-center font-style-title',
              !book.subtitle && 'mb-4 sm:mb-0'
            )}
          >
            <h1>{book.title}</h1>
            <Wrap c={BookOverflow} book={book} className="ml-auto" />
          </div>
          {book.subtitle ? (
            <Detail>{book.subtitle}</Detail>
          ) : (
            <hr className="hidden sm:block" />
          )}
        </div>
        <AntiContainer className="border-t border-black sm:border-t-0 md:-mt-8">
          <div className="flex flex-col lg:absolute lg:top-0 lg:right-0 lg:-bottom-20 lg:w-[50vw]">
            <Wrap
              c={CoverCarousel}
              book={book}
              className="lg:sticky lg:top-0 lg:-mt-16 lg:flex lg:h-full lg:max-h-screen lg:items-stretch lg:pt-16"
            />
          </div>
        </AntiContainer>
        {book.authors.length > 0 && (
          <AntiContainer desktop={false}>
            <Container
              desktop={false}
              className="border-t border-black max-sm:py-4 sm:border-t-0"
            >
              <ProfileListSection
                profiles={book.authors}
                title={book.authors.length > 1 ? 'Authors' : 'Author'}
                hideMeta
              />
            </Container>
          </AntiContainer>
        )}
        <AntiContainer desktop={false}>
          <Container
            desktop={false}
            className="flex flex-col gap-4 border-t border-black max-sm:py-4 sm:border-t-0"
          >
            {book.team.length > 0 && (
              <TeamList contributions={book.contributions} />
            )}
            <Wrap c={CorrectionButton} book={book} />
          </Container>
        </AntiContainer>
        {book.blurb && (
          <Detail spacier>
            <MaxHeight>
              <p>{book.blurb}</p>
            </MaxHeight>
          </Detail>
        )}
        <BookLinks links={book.links} className="w-full max-sm:py-4" />
      </Container>
      <Container
        className={cn(
          'flex flex-wrap gap-x-4',
          !book.links.length && 'max-sm:-mt-px'
        )}
      >
        {book.publisher && (
          <Detail className="flex flex-col items-start gap-2" column>
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
      <Suspense>
        <SimilarBooks slug={book.slug} className="max-sm:mt-8" />
      </Suspense>
      {book.designCommentary && (
        <DesignCommentary
          title="Why we like this cover"
          content={book.designCommentary}
        />
      )}
    </div>
  )
})

export async function generateMetadata(
  props: PageProps<'/cookbooks/[slug]'>,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { slug } = await props.params
  const [{ data: book }, count] = await Promise.all([
    call(fetchBook, { slug, onlyPublished: true }),
    bookTotal
  ])
  if (!book) notFound()

  return genMetadata(`/cookbooks/${book.slug}`, await parent, {
    title: book.title,
    description: `View the ${book.title} cookbook and ${
      count - 1
    } other curated cookbooks on Books About Food — beautifully designed cookbooks and the people making them.`,
    openGraph: {
      type: 'book',
      releaseDate: book.isoReleaseDate,
      tags: ['Cookbook', ...book.tagNames],
      authors: book.authors.map((author) => appUrl(`/people/${author.slug}`)),
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

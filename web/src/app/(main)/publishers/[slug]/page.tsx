import { fetchPromo } from '@books-about-food/core/services/publishers/fetch-promo'
import { fetchPublisher } from '@books-about-food/core/services/publishers/fetch-publisher'
import cn from 'classnames'
import { Metadata, ResolvedMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { Pill } from 'src/components/atoms/pill'
import {
  PublisherBookList,
  SkeletonPublisherBookList
} from 'src/components/publishers/book-list'
import { ClaimPublisherButton } from 'src/components/publishers/claim-button'
import { EditPublisherProvider } from 'src/components/publishers/edit/context'
import { EditableLogo } from 'src/components/publishers/edit/editable-logo'
import { PromoCarousel } from 'src/components/publishers/edit/promo-carousel'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'
import { getHostname } from 'src/utils/url-helpers'

type PublisherPageProps = PageProps<{ slug: string }>

export async function generateMetadata(
  { params: { slug } }: PublisherPageProps,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { data: publisher } = await call(fetchPublisher, { slug })
  if (!publisher) notFound()

  return {
    title: publisher.name,
    description: `${publisher.name} on Books About Food`,
    alternates: {
      canonical: `/publishers/${publisher.slug}`
    },
    openGraph: {
      ...(await parent).openGraph,
      images: [
        {
          url: `/publishers/${publisher.slug}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${publisher.name} on Books About Food`
        }
      ],
      title: publisher.name,
      description: `${publisher.name} on Books About Food`,
      url: `https://booksaboutfood.info/publishers/${publisher.slug}`
    }
  }
}

export * from 'app/default-static-config'

export default async ({ params: { slug } }: PublisherPageProps) => {
  const [{ data: publisher }, { data: promo }] = await Promise.all([
    call(fetchPublisher, { slug }),
    call(fetchPromo, { publisherSlug: slug })
  ])
  if (!publisher) return notFound()

  return (
    <EditPublisherProvider publisher={publisher} promo={promo} data-superjson>
      <Container
        belowNav
        className={cn(promo && 'edit-bg bg-white pb-8 sm:pb-20')}
      >
        <div className={cn('pt-8 md:pt-16 z-30 relative')}>
          <div className="font-style-title mb-6 flex items-center justify-between sm:mb-4">
            <h1 title={publisher.name}>
              <EditableLogo />
            </h1>
            <ClaimPublisherButton />
          </div>
        </div>
        <PromoCarousel />
      </Container>
      <Container className="mt-8 sm:mt-20">
        <Suspense fallback={<SkeletonPublisherBookList />}>
          <PublisherBookList publisher={publisher} />
        </Suspense>
        <div className="py-8 md:py-20">
          {publisher.house && (
            <Detail maxWidth className="flex flex-col gap-2 items-start">
              <p className="all-caps">An imprint of</p>
              <Link href={`/publishers/${publisher.house.slug}`}>
                <Pill variant="filled" small>
                  {publisher.house.name}
                </Pill>
              </Link>
            </Detail>
          )}
          {publisher.imprints.length > 0 && (
            <Detail maxWidth className="flex flex-col gap-2 items-start">
              <p className="all-caps">Imprints</p>
              {publisher.imprints.map((imprint) => (
                <Link href={`/publishers/${imprint.slug}`} key={imprint.slug}>
                  <Pill variant="filled" small>
                    {imprint.name}
                  </Pill>
                </Link>
              ))}
            </Detail>
          )}
          {(publisher.website || publisher.instagram) && (
            <Detail maxWidth>
              {publisher.website && (
                <a
                  className="underline"
                  href={publisher.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {getHostname(publisher.website)}
                </a>
              )}
              {publisher.website && publisher.instagram && ' • '}
              {publisher.instagram && (
                <a
                  className="underline"
                  href={`https://instagram.com/${publisher.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{publisher.instagram}
                </a>
              )}
            </Detail>
          )}
        </div>
      </Container>
    </EditPublisherProvider>
  )
}

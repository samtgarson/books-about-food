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
import { ContactInfo } from 'src/components/publishers/edit/contact-info'
import { EditPublisherProvider } from 'src/components/publishers/edit/context'
import { EditableLogo } from 'src/components/publishers/edit/editable-logo'
import { LinkList } from 'src/components/publishers/edit/link-list'
import { PromoCarousel } from 'src/components/publishers/edit/promo-carousel'
import { PageProps } from 'src/components/types'
import { genMetadata, publisherTotal } from 'src/utils/metadata'
import { call } from 'src/utils/service'

type PublisherPageProps = PageProps<{ slug: string }>

export async function generateMetadata(
  { params: { slug } }: PublisherPageProps,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const [{ data: publisher }, total = 1000] = await Promise.all([
    call(fetchPublisher, { slug }),
    publisherTotal
  ])
  if (!publisher) notFound()

  return genMetadata(`/publishers/${slug}`, await parent, {
    title: publisher.name,
    description: `View cookbooks published by ${publisher.name} and ${
      total - 1
    } other publishers on Books About Food — the cookbook industry's new digital home.`,
    openGraph: {
      images: [
        {
          url: `/publishers/${publisher.slug}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${publisher.name} on Books About Food`
        }
      ]
    }
  })
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
          <LinkList />
          <ContactInfo />
        </div>
      </Container>
    </EditPublisherProvider>
  )
}

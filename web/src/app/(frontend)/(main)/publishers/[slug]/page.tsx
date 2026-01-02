import { Metadata, ResolvedMetadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { Pill, PillList } from 'src/components/atoms/pill'
import {
  PublisherBookList,
  SkeletonPublisherBookList
} from 'src/components/publishers/book-list'
import { ClaimPublisherButton } from 'src/components/publishers/claim-button'
import { EditPublisherProvider } from 'src/components/publishers/edit/context'
import { Description } from 'src/components/publishers/edit/description'
import { EditableLogo } from 'src/components/publishers/edit/editable-logo'
import { LinkList } from 'src/components/publishers/edit/link-list'
import { FeaturedCollection } from 'src/components/publishers/featured-collection'
import { slugPage } from 'src/components/types'
import { Wrap } from 'src/components/utils/wrap'
import { fetchCollections } from 'src/core/services/collections/fetch-collections'
import { fetchPublisher } from 'src/core/services/publishers/fetch-publisher'
import { genMetadata, publisherTotal } from 'src/utils/metadata'
import { call } from 'src/utils/service'

export async function generateMetadata(
  props: PageProps<'/publishers/[slug]'>,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { slug } = await props.params

  const [{ data: publisher }, total] = await Promise.all([
    call(fetchPublisher, { slug }),
    publisherTotal
  ])
  if (!publisher) notFound()

  return genMetadata(`/publishers/${slug}`, await parent, {
    title: publisher.name,
    description: `View cookbooks published by ${publisher.name} and ${
      total - 1
    } other publishers on Books About Food — beautifully designed cookbooks and the people making them.`,
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

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

export default slugPage<'/publishers/[slug]'>(
  async function PublisherPage(slug) {
    const [
      { data: publisher },
      { data: { collections: [collection] = [] } = {} }
    ] = await Promise.all([
      call(fetchPublisher, { slug }),
      call(fetchCollections, {
        publisherSlug: slug,
        perPage: 1,
        publisherFeatured: true
      })
    ])
    if (!publisher) return notFound()

    return (
      <Wrap c={EditPublisherProvider} publisher={publisher}>
        <Container belowNav>
          <div className="flex items-center justify-between py-14 font-style-title">
            <h1 title={publisher.name}>
              <EditableLogo />
            </h1>
            <ClaimPublisherButton />
          </div>
          {collection && <FeaturedCollection collection={collection} />}
        </Container>
        <Container className="flex flex-row flex-wrap justify-between gap-12">
          <Description className="w-min max-w-4xl shrink grow sm:min-w-[650px]" />
          <div className="w-96">
            {publisher.house && (
              <Detail maxWidth className="flex flex-col items-start gap-2">
                <p className="all-caps">An imprint of</p>
                <Link href={`/publishers/${publisher.house.slug}`}>
                  <Pill variant="filled" small>
                    {publisher.house.name}
                  </Pill>
                </Link>
              </Detail>
            )}
            {publisher.imprints.length > 0 && (
              <Detail maxWidth className="flex flex-col items-start gap-2">
                <p className="all-caps">Imprints</p>
                <PillList>
                  {publisher.imprints.map((imprint) => (
                    <Link
                      href={`/publishers/${imprint.slug}`}
                      key={imprint.slug}
                    >
                      <Pill variant="filled" small>
                        {imprint.name}
                      </Pill>
                    </Link>
                  ))}
                </PillList>
              </Detail>
            )}
            <LinkList />
          </div>
        </Container>
        <Container className="mt-8 sm:mt-20">
          <Suspense fallback={<SkeletonPublisherBookList />}>
            <PublisherBookList publisher={publisher} />
          </Suspense>
        </Container>
      </Wrap>
    )
  }
)

import { fetchPublisher } from '@books-about-food/core/services/publishers/fetch-publisher'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { Loader } from 'src/components/atoms/loader'
import { Pill } from 'src/components/atoms/pill'
import { PublisherBookList } from 'src/components/publishers/book-list'
import { ClaimPublisherButton } from 'src/components/publishers/claim-button'
import { EditPublisherProvider } from 'src/components/publishers/edit/context'
import { EditableLogo } from 'src/components/publishers/edit/editable-logo'
import { PageProps } from 'src/components/types'
import { call } from 'src/utils/service'

type PublisherPageProps = PageProps<{ slug: string }>

export async function generateMetadata({
  params: { slug }
}: PublisherPageProps): Promise<Metadata> {
  const { data: publisher } = await call(fetchPublisher, { slug })
  if (!publisher) notFound()

  return { title: publisher.name }
}

export * from 'app/default-static-config'

export default async ({
  params: { slug },
  searchParams: { page }
}: PublisherPageProps) => {
  const { data: publisher } = await call(fetchPublisher, { slug })
  if (!publisher) return notFound()

  return (
    <EditPublisherProvider publisher={publisher} data-superjson>
      <Container belowNav>
        <div className="py-8 md:py-20">
          <div className="font-style-title mb-6 flex items-center justify-between sm:mb-4">
            <h1 title={publisher.name}>
              <EditableLogo />
            </h1>
            <ClaimPublisherButton />
          </div>
        </div>
        <Suspense fallback={<Loader className="mx-auto" />}>
          <PublisherBookList
            publisher={publisher}
            page={parseInt(`${page}`) || 0}
          />
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
                  {publisher.website}
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

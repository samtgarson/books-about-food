import { Publisher } from '@books-about-food/core/models/publisher'
import { publisherIncludes } from '@books-about-food/core/services/utils'
import prisma from '@books-about-food/database'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Detail } from 'src/components/atoms/detail'
import { Loader } from 'src/components/atoms/loader'
import { Pill } from 'src/components/atoms/pill'
import { BookList } from 'src/components/books/list'
import { ListContainer } from 'src/components/lists/list-context'
import { ClaimPublisherButton } from 'src/components/publishers/claim-button'
import { PageProps } from 'src/components/types'

type PublisherPageProps = PageProps<{ slug: string }>

export async function generateMetadata({
  params: { slug }
}: PublisherPageProps): Promise<Metadata> {
  const publisher = await fetchPublisher(slug)
  if (!publisher) notFound()

  return { title: publisher.name }
}

export * from 'app/default-static-config'

const fetchPublisher = async (slug: string) => {
  const raw = await prisma.publisher.findUnique({
    where: { slug },
    include: publisherIncludes
  })

  if (raw) return new Publisher(raw)
}

export default async ({
  params: { slug },
  searchParams: { page }
}: PublisherPageProps) => {
  const publisher = await fetchPublisher(slug)
  if (!publisher) return notFound()

  return (
    <Container belowNav>
      <div className="py-8 md:py-20">
        <div className="font-style-title mb-6 flex items-center justify-between sm:mb-4">
          <h1 title={publisher.name}>
            {publisher.logo ? (
              <Image
                {...publisher.logo.imageAttrs(80)}
                className="h-[80px] w-[150px] object-contain object-left mix-blend-darken"
              />
            ) : (
              publisher.name
            )}
          </h1>
          <ClaimPublisherButton publisherName={publisher.name} />
        </div>
      </div>
      <ListContainer title="All Releases">
        <Suspense fallback={<Loader className="mx-auto" />}>
          <BookList
            itemProps={{ mobileColorful: true }}
            filters={{
              publisherSlug: slug,
              page: page ? parseInt(`${page}`) : 0,
              perPage: 12
            }}
          />
        </Suspense>
      </ListContainer>
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
  )
}

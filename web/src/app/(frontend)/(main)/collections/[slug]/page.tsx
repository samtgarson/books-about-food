import { Metadata, ResolvedMetadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import logo from 'src/assets/images/bookshop-org-logo.svg'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { BookGrid } from 'src/components/books/grid'
import { EditorRenderer } from 'src/components/form/editor/renderer'
import { ListContainer } from 'src/components/lists/list-container'
import { slugPage } from 'src/components/types'
import { fetchCollection } from 'src/core/services/collections/fetch-collection'
import { fetchCollections } from 'src/core/services/collections/fetch-collections'
import { genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'

export const dynamic = 'error'
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const { data: { collections } = {} } = await call(fetchCollections, {
    publisherSlug: undefined
  })
  if (!collections) return []

  const slugs = collections.map((collection) => ({ slug: collection.slug }))
  return slugs
}

export default slugPage<'/collections/[slug]'>(
  async function CollectionPage(slug) {
    const { data: collection } = await call(fetchCollection, { slug })
    if (!collection) notFound()

    return (
      <Container belowNav>
        <PageTitle>
          <span>
            <span className="block opacity-40">Cookbook Collection</span>
            {collection.title}
          </span>
        </PageTitle>
        <div className="flex flex-col items-stretch justify-end gap-8 pb-10 md:pb-20 lg:flex-row lg:items-end">
          {collection.description && (
            <EditorRenderer
              content={collection.description}
              className="mr-auto max-w-prose"
            />
          )}
          {collection.bookshopDotOrgUrl && (
            <a
              href={collection.bookshopDotOrgUrl}
              className="flex max-w-[400px] flex-col gap-4 bg-white p-8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={logo}
                width={150}
                height={20}
                alt="Bookshop.org logo"
              />
              <p className="font-medium text-[#573BA3]">
                Support BAF and indie bookshops. View this collection on{' '}
                <span className="underline">Bookshop.org</span>
              </p>
            </a>
          )}
        </div>
        <ListContainer display="grid">
          <BookGrid
            books={collection.books}
            size="large"
            itemProps={{ colorful: true }}
          />
        </ListContainer>
      </Container>
    )
  }
)

export async function generateMetadata(
  props: PageProps<'/collections/[slug]'>,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { slug } = await props.params

  const { data: collection } = await call(fetchCollection, { slug })
  if (!collection) notFound()

  return genMetadata(`/collections/${collection.slug}`, await parent, {
    title: collection.title,
    description: `View the ${collection.title} collection and other curated cookbook collections on Books About Food — beautifully designed cookbooks and the people making them.`,
    openGraph: {
      images: [
        {
          url: `/collections/${collection.slug}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${collection.title} collection on Books About Food`
        }
      ]
    }
  })
}

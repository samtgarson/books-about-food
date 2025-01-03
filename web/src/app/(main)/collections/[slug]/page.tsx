import { fetchCollection } from '@books-about-food/core/services/collections/fetch-collection'
import { fetchCollections } from '@books-about-food/core/services/collections/fetch-collections'
import { Metadata, ResolvedMetadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import logo from 'src/assets/images/bookshop-org-logo.svg'
import { Container } from 'src/components/atoms/container'
import { PageTitle } from 'src/components/atoms/page-title'
import { BookGrid } from 'src/components/books/grid'
import { EditorRenderer } from 'src/components/form/editor/renderer'
import { ListContainer } from 'src/components/lists/list-context'
import { PageProps } from 'src/components/types'
import { genMetadata } from 'src/utils/metadata'
import { call } from 'src/utils/service'

type CollectionPageProps = PageProps<{ slug: string }>

export { dynamic, dynamicParams, revalidate } from 'app/default-static-config'

export async function generateStaticParams() {
  const { data } = await call(fetchCollections, { publisherSlug: undefined })
  if (!data) return []

  const slugs = data.map((collection) => ({ slug: collection.slug }))
  return slugs
}

export default async function CollectionPage({
  params: { slug }
}: CollectionPageProps) {
  const { data: collection } = await call(fetchCollection, { slug })
  if (!collection) notFound()

  return (
    <Container belowNav>
      <PageTitle>
        <span>
          <span className="opacity-40 block">Cookbook Collection</span>
          {collection.title}
        </span>
      </PageTitle>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-end gap-8 pb-10 md:pb-20">
        {collection.description && (
          <EditorRenderer
            content={collection.description}
            className="max-w-prose mr-auto"
          />
        )}
        {collection.bookshopDotOrgUrl && (
          <a
            href={collection.bookshopDotOrgUrl}
            className="bg-white flex flex-col gap-4 p-8 max-w-[400px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={logo} width={150} height={20} alt="Bookshop.org logo" />
            <p className="text-[#573BA3] font-medium">
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

export async function generateMetadata(
  { params: { slug } }: CollectionPageProps,
  parent: Promise<ResolvedMetadata>
): Promise<Metadata> {
  const { data: collection } = await call(fetchCollection, { slug })
  if (!collection) notFound()

  return genMetadata(`/collections/${collection.slug}`, await parent, {
    title: collection.title,
    description: `View the ${collection.title} collection other curated cookbook collections on Books About Food — the cookbook industry’s new digital home.`,
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

import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'
import { getPayloadClient } from 'src/core/services/utils/payload'

const titleTemplate = (t: string) => `${t} on Books About Food`

export function genMetadata(
  path: string,
  parent: ResolvedMetadata | null,
  {
    openGraph,
    title,
    image,
    ...rest
  }: Omit<Metadata, 'title' | 'description'> & {
    title: string
    description: string
    image?: string
  }
): Metadata {
  const metadata: Metadata = {
    openGraph: {
      ...parent?.openGraph,
      title: titleTemplate(title),
      description: rest.description,
      url: new URL(path, appUrl()).toString(),
      ...openGraph
    },
    alternates: {
      canonical: path
    },
    title: titleTemplate(title),
    ...rest
  }

  if (image)
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: titleTemplate(title)
        }
      ]
    }
  return metadata
}

export const bookTotal = (async () => {
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'books',
    where: { status: { equals: 'published' } }
  })
  return totalDocs
})()

export async function profileTotal() {
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'profiles',
    // FIXME: implement this filter during the migration to Payload
    where: {
      // 'contributions.status': { equals: 'published' }
    }
  })
  return totalDocs
}

export const publisherTotal = (async () => {
  const payload = await getPayloadClient()
  const { totalDocs } = await payload.count({
    collection: 'publishers',
    where: {
      'books.status': { equals: 'published' }
    }
  })
  return totalDocs
})()

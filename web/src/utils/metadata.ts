import prisma from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'
import { FETCH_PROFILES_ONLY_PUBLISHED_QUERY } from 'src/core/services/profiles/fetch-profiles'

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

export const bookTotal = prisma.book.count({ where: { status: 'published' } })
export const profileTotal = prisma.profile.count({
  where: FETCH_PROFILES_ONLY_PUBLISHED_QUERY
})
export const publisherTotal = prisma.publisher.count({
  where: { books: { some: { status: 'published' } } }
})

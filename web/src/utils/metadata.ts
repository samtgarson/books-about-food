import { FETCH_PROFILES_ONLY_PUBLISHED_QUERY } from '@books-about-food/core/services/profiles/fetch-profiles'
import prisma from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'

const titleTemplate = (t: string) => `${t} on Books About Food`

export const genMetadata = (
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
): Metadata => ({
  openGraph: {
    ...parent?.openGraph,
    title: titleTemplate(title),
    description: rest.description,
    url: new URL(path, appUrl()).toString(),
    images: image
      ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: titleTemplate(title)
          }
        ]
      : undefined,
    ...openGraph
  },
  alternates: {
    canonical: path
  },
  title: titleTemplate(title),
  ...rest
})

export const bookTotal = prisma.book.count({ where: { status: 'published' } })
export const profileTotal = prisma.profile.count({
  where: FETCH_PROFILES_ONLY_PUBLISHED_QUERY
})
export const publisherTotal = prisma.publisher.count({
  where: { books: { some: { status: 'published' } } }
})

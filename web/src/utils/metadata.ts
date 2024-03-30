import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { fetchPublishers } from '@books-about-food/core/services/publishers/fetch-publishers'
import { appUrl } from '@books-about-food/core/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'
import { call } from './service'

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

export const bookTotal = call(fetchBooks, { perPage: 0 }).then(
  (res) => res.data?.total
)
export const profileTotal = call(fetchProfiles, { perPage: 0 }).then(
  (res) => res.data?.total
)
export const publisherTotal = call(fetchPublishers, { perPage: 0 }).then(
  (res) => res.data?.total
)

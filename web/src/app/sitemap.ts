import { appUrl } from '@books-about-food/shared/utils/app-url'
import { MetadataRoute } from 'next'
import { getPayloadClient } from 'src/core/services/utils/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  // TODO: Return to this once we have search results re-implemented in payload

  // Fetch all published books
  const { docs: books } = await payload.find({
    collection: 'books',
    where: { status: { equals: 'published' } },
    pagination: false,
    depth: 0
  })

  // Fetch all profiles (authors and contributors)
  const { docs: profiles } = await payload.find({
    collection: 'profiles',
    pagination: false,
    depth: 0
  })

  // Fetch all publishers
  const { docs: publishers } = await payload.find({
    collection: 'publishers',
    pagination: false,
    depth: 0
  })

  // Fetch all collections
  const { docs: collections } = await payload.find({
    collection: 'collections',
    pagination: false,
    depth: 0
  })

  return [
    {
      url: appUrl(),
      priority: 1,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: appUrl('/about'),
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'monthly'
    },
    {
      url: appUrl('/frequently-asked-questions'),
      priority: 0.2,
      lastModified: new Date(),
      changeFrequency: 'monthly'
    },
    {
      url: appUrl('/cookbooks'),
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: appUrl('/people'),
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: appUrl('/publishers'),
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: appUrl('/top-ten/2024'),
      priority: 1,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    ...books.map((book) => ({
      url: appUrl(`/cookbooks/${book.slug}`),
      priority: 0.8,
      lastModified: new Date(book.updatedAt),
      changeFrequency: 'weekly' as const
    })),
    ...profiles.map((profile) => ({
      url: appUrl(`/people/${profile.slug}`),
      priority: 0.8,
      lastModified: new Date(profile.updatedAt),
      changeFrequency: 'weekly' as const
    })),
    ...publishers.map((publisher) => ({
      url: appUrl(`/publishers/${publisher.slug}`),
      priority: 0.8,
      lastModified: new Date(publisher.updatedAt),
      changeFrequency: 'weekly' as const
    })),
    ...collections.map((collection) => ({
      url: appUrl(`/collections/${collection.slug}`),
      priority: 0.8,
      lastModified: new Date(collection.updatedAt),
      changeFrequency: 'weekly' as const
    }))
  ]
}

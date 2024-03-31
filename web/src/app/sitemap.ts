import { SearchResult } from '@books-about-food/core/models/search-result'
import prisma from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const records = await prisma.searchResult.findMany({
    where: { type: { in: ['book', 'author', 'contributor', 'publisher'] } }
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
      url: appUrl('/authors'),
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
    ...records.map(function (record): MetadataRoute.Sitemap[number] {
      const model = new SearchResult(record)
      return {
        url: appUrl(model.href),
        priority: 0.8,
        lastModified: model.updatedAt,
        changeFrequency: 'weekly'
      }
    })
  ]
}

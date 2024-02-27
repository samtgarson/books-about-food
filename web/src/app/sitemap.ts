import { SearchResult } from '@books-about-food/core/models/search-result'
import prisma from '@books-about-food/database'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const records = await prisma.searchResult.findMany({
    where: { type: { in: ['book', 'author', 'contributor', 'publisher'] } }
  })

  return [
    {
      url: 'https://www.booksaboutfood.info',
      priority: 1,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: 'https://www.booksaboutfood.info/about',
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'monthly'
    },
    {
      url: 'https://www.booksaboutfood.info/frequently-asked-questions',
      priority: 0.2,
      lastModified: new Date(),
      changeFrequency: 'monthly'
    },
    {
      url: 'https://www.booksaboutfood.info/cookbooks',
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: 'https://www.booksaboutfood.info/authors',
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: 'https://www.booksaboutfood.info/people',
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    {
      url: 'https://www.booksaboutfood.info/publishers',
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: 'daily'
    },
    ...records.map(function (record): MetadataRoute.Sitemap[number] {
      const model = new SearchResult(record)
      return {
        url: new URL(model.href, 'https://www.booksaboutfood.info').toString(),
        priority: 0.8,
        lastModified: model.updatedAt,
        changeFrequency: 'weekly'
      }
    })
  ]
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/edit/', '/account/']
    },
    sitemap: 'https://www.booksaboutfood.info/sitemap.xml'
  }
}

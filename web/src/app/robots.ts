import { appUrl } from '@books-about-food/shared/utils/app-url'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/edit/', '/account/', '/splash', '/_next/', '/api/', '/auth/']
    },
    sitemap: new URL('/sitemap.xml', appUrl()).toString()
  }
}

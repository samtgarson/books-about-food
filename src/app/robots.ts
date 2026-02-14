import { MetadataRoute } from 'next'
import { appUrl } from '../utils/app-url'

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

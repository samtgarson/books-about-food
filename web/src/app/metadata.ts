import { appUrl } from '@books-about-food/shared/utils/app-url'
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title:
    'Books About Food - Beautifully designed cookbooks and the people making them.',
  description:
    'Books About Food is a unique, design-forward space created to showcase books about food and the people involved in making them.',
  metadataBase: new URL(appUrl()),
  keywords: [
    'Cookbooks',
    'Food',
    'Recipes',
    'Publishing',
    'Books',
    'Cover Design'
  ],
  openGraph: {
    siteName: 'Books About Food',
    locale: 'en_GB',
    title:
      'Books About Food - Beautifully designed cookbooks and the people making them.',
    description:
      'Books About Food is a unique, design-forward space created to showcase books about food and the people involved in making them.',
    type: 'website'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true
}

import { appUrl } from '@books-about-food/core/utils/app-url'
import { Metadata, Viewport } from 'next'

export const metadata = {
  title: "Books About Food - The cookbook industry's new digital home.",
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
    title: "Books About Food - The cookbook industry's new digital home.",
    description:
      'Books About Food is a unique, design-forward space created to showcase books about food and the people involved in making them.',
    type: 'website'
  }
} satisfies Metadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: false
}

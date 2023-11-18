import { appUrl } from '@books-about-food/core/utils/app-url'
import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates:
    process.env.NODE_ENV === 'production'
      ? { canonical: 'https://booksaboutfood.info' }
      : {},
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  title: {
    template: '%s | Books About Food',
    default: 'Books About Food'
  },
  description: "The cookbook industry's new digital home.",
  metadataBase: new URL(appUrl())
}

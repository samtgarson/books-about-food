import { appUrl } from '@books-about-food/core/utils/app-url'
import { Metadata, Viewport } from 'next'

export const metadata = {
  alternates: { canonical: 'https://booksaboutfood.info' },
  title: {
    template: '%s | Books About Food',
    default: 'Books About Food'
  },
  description: "The cookbook industry's new digital home.",
  metadataBase: new URL(appUrl()),
  openGraph: {
    siteName: 'Books About Food',
    locale: 'en_GB'
  }
} satisfies Metadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false
}

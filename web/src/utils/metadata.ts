import { appUrl } from '@books-about-food/core/utils/app-url'
import { Metadata, ResolvedMetadata } from 'next'

export const metaDescription = (resource: string) =>
  `${resource} is on Books About Food, the cookbook industry's new digital home.`

export const genMetadata = (
  resource: string,
  path: string,
  parent?: ResolvedMetadata | null,
  { openGraph, ...rest }: Metadata = {}
): Metadata => ({
  title: resource,
  description: metaDescription(resource),
  openGraph: {
    ...parent?.openGraph,
    title: `${resource} on Books About Food`,
    description: metaDescription(resource),
    url: new URL(path, appUrl()).toString(),
    type: 'website',
    ...openGraph
  },
  alternates: {
    canonical: path
  },
  ...rest
})

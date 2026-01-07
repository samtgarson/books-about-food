/**
 * Legacy types file - minimal re-exports for backward compatibility.
 * Model types are now defined inline in their respective model files.
 */

import type { BookContributions } from 'src/payload/payload-types'

// Re-export Payload types for convenience
export type * from 'src/payload/payload-types'

// Book search result type (used by book-select components)
export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export type BookContribution = Exclude<BookContributions, null>[number]

export type BookLink = {
  id: string
  url: string
  site: string
}

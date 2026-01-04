/**
 * Legacy types file - minimal re-exports for backward compatibility.
 * Model types are now defined inline in their respective model files.
 */

import type {
  BookContributions,
  Book as PayloadBook
} from 'src/payload/payload-types'

// Re-export Payload types for convenience
export type { BookVote, TagGroup } from 'src/payload/payload-types'

// Legacy type aliases - prefer importing PayloadBook directly
export type BookAttrs = PayloadBook

// Book search result type (used by book-select components)
export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export type BookContribution = Exclude<BookContributions, null>[number]

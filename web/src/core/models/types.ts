/**
 * Legacy types file - minimal re-exports for backward compatibility.
 * Model types are now defined inline in their respective model files.
 */

import type {
  Book as PayloadBook,
  Image as PayloadImage,
  Publisher as PayloadPublisher
} from 'src/payload/payload-types'

// Re-export Payload types for convenience
export type { BookVote, TagGroup } from 'src/payload/payload-types'

// Legacy type aliases - prefer importing PayloadBook directly
export type BookAttrs = PayloadBook

// Full book type with additional resolved fields (used by update-book service)
export type FullBookAttrs = PayloadBook & {
  previewImages?: Array<{
    image: PayloadImage
    id?: string | null
  }>
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  publisher?: PayloadPublisher
  links?: NonNullable<PayloadBook['links']>
}

// Book search result type (used by book-select components)
export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

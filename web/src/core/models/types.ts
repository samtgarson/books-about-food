/**
 * Legacy types file - minimal re-exports for backward compatibility.
 * Model types are now defined inline in their respective model files.
 */

import type { BookContributions, User } from 'src/payload/payload-types'
import { enum_books_links_site } from 'src/payload/schema'

// Re-export Payload types for convenience
export type * from 'src/payload/payload-types'

// Book search result type (used by book-select components)
export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export type BookContribution = NonNullable<BookContributions>[number]
export type Account = NonNullable<User['accounts']>[number]
export type BookLinkSite = (typeof enum_books_links_site.enumValues)[number]

export type BookLink = {
  id: string
  url: string
  site: string
}

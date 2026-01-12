import { PgEnum } from '@payloadcms/db-postgres/drizzle/pg-core'
import type { BookContributions, User } from 'src/payload/payload-types'
import {
  enum_books_links_site,
  enum_memberships_role
} from 'src/payload/schema'

// Re-export Payload types for convenience
export type * from 'src/payload/payload-types'

// Book search result type (used by book-select components)
export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PgEnumValue<T extends PgEnum<any>> =
  T extends PgEnum<infer U> ? U[number] : never

export type BookContribution = NonNullable<BookContributions>[number]
export type Account = NonNullable<User['accounts']>[number]
export type BookLinkSite = PgEnumValue<typeof enum_books_links_site>
export type MembershipRole = PgEnumValue<typeof enum_memberships_role>

export type BookLink = {
  id: string
  url: string
  site: string
}

export type BookStatus = 'draft' | 'inReview' | 'published'

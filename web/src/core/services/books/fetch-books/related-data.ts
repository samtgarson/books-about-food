import { Hsl } from '@books-about-food/shared/utils/types'
import { and, eq, inArray } from '@payloadcms/db-postgres/drizzle'
import { BookContribution } from 'src/core/models/types'
import {
  books_contributions,
  books_palette,
  books_rels,
  images,
  jobs,
  profiles
} from 'src/payload/schema'
import { z } from 'zod'
import { profileColumns } from './columns'
import type { Drizzle } from './types'

/**
 * Fetch authors for multiple books in a single query
 */
export async function fetchAuthorsForBooks(db: Drizzle, bookIds: string[]) {
  const authorsData = await db
    .select({
      bookId: books_rels.parent,
      ...profileColumns
    })
    .from(books_rels)
    .innerJoin(profiles, eq(books_rels.profilesID, profiles.id))
    .leftJoin(images, eq(profiles.avatar, images.id))
    .where(
      and(inArray(books_rels.parent, bookIds), eq(books_rels.path, 'authors'))
    )

  // Group by book ID - extract profile columns
  type AuthorRow = Omit<(typeof authorsData)[0], 'bookId'>
  const authorsMap = new Map<string, AuthorRow[]>()
  for (const row of authorsData) {
    const { bookId, ...profile } = row
    const existing = authorsMap.get(bookId) || []
    existing.push(profile)
    authorsMap.set(bookId, existing)
  }

  return authorsMap
}

/**
 * Fetch contributions for multiple books in a single query
 */
export async function fetchContributionsForBooks(
  db: Drizzle,
  bookIds: string[]
) {
  const { avatar, ...profileCols } = profileColumns

  const contributionsData = await db
    .select({
      bookId: books_contributions._parentID,
      profile: {
        ...profileCols
      },
      profileAvatar: avatar,
      job: {
        id: jobs.id,
        name: jobs.name,
        featured: jobs.featured,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt
      },
      tag: books_contributions.tag
    })
    .from(books_contributions)
    .innerJoin(profiles, eq(books_contributions.profile, profiles.id))
    .leftJoin(images, eq(profiles.avatar, images.id))
    .innerJoin(jobs, eq(books_contributions.job, jobs.id))
    .where(inArray(books_contributions._parentID, bookIds))

  const contributionsMap = new Map<string, BookContribution[]>()
  for (const row of contributionsData) {
    const { bookId, profileAvatar, ...contribution } = row
    const existing = contributionsMap.get(bookId) || []
    existing.push({
      ...contribution,
      profile: { ...contribution.profile, avatar: profileAvatar }
    })
    contributionsMap.set(bookId, existing)
  }

  return contributionsMap
}

/**
 * Fetch palette colors for multiple books in a single query
 */
export async function fetchPaletteForBooks(db: Drizzle, bookIds: string[]) {
  const paletteData = await db
    .select({
      bookId: books_palette._parentID,
      color: books_palette.color
    })
    .from(books_palette)
    .where(inArray(books_palette._parentID, bookIds))
    .orderBy(books_palette._order)

  // Group by book ID
  const paletteMap = new Map<string, { color: Hsl }[]>()
  for (const row of paletteData) {
    const existing = paletteMap.get(row.bookId) || []
    existing.push({ color: toHsl(row.color) })
    paletteMap.set(row.bookId, existing)
  }

  return paletteMap
}

function toHsl(color: unknown) {
  return z
    .object({ h: z.number(), s: z.number(), l: z.number() })
    .parse(color) as Hsl
}

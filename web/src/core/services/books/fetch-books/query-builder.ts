import { wrapArray } from '@books-about-food/shared/utils/array'
import {
  SQL,
  and,
  eq,
  getTableColumns,
  gte,
  inArray,
  lte,
  or,
  sql
} from '@payloadcms/db-postgres/drizzle'
import { PgSelect } from '@payloadcms/db-postgres/drizzle/pg-core'
import {
  books,
  books_contributions,
  books_palette,
  books_rels,
  images,
  profiles,
  publishers,
  tags
} from 'src/payload/schema'
import { NamedColor } from '../colors'
import { fetchBooksPageFilters } from '../filters'
import { colorMatchCondition, colorMatchScore } from './color-matching'
import { imageColumns } from './columns'
import type { BookSort, Drizzle, FetchBooksInput } from './types'

export function selectBooks(
  db: Drizzle,
  filters: Omit<FetchBooksInput, 'page' | 'perPage' | 'sort'>,
  sortKey: BookSort
) {
  const {
    publisher: _p,
    submitter: _s,
    coverImage: _ci,
    ...bookCols
  } = getTableColumns(books)

  const select = db
    .select({
      ...bookCols,

      // Cover image
      coverImage: imageColumns,

      // Publisher
      publisher: {
        id: publishers.id,
        name: publishers.name,
        slug: publishers.slug,
        createdAt: publishers.createdAt,
        updatedAt: publishers.updatedAt
      },

      // Color match score (for sorting when color filter is active)
      // Uses a correlated subquery to find the best matching color in the palette
      // When no color filter but sorting by color, use the first palette entry's hue
      color_match: filters.color
        ? sql<number>`(
            SELECT MAX(${colorMatchScore(filters.color)})
            FROM ${books_palette}
            WHERE ${books_palette._parentID} = ${books.id}
          )`.as('color_match')
        : sortKey === 'color'
          ? sql<number>`(
              SELECT (${books_palette.color} ->> 'h')::decimal
              FROM ${books_palette}
              WHERE ${books_palette._parentID} = ${books.id}
              ORDER BY ${books_palette._order} ASC
              LIMIT 1
            )`.as('color_match')
          : sql<number | null>`NULL`.as('color_match')
    })
    .from(books)

  return withFiltersAndJoins(db, select.$dynamic(), filters)
}

export function withFiltersAndJoins<T extends PgSelect>(
  db: Drizzle,
  qb: T,
  filters: Omit<FetchBooksInput, 'page' | 'perPage' | 'sort'>
) {
  const where = buildWhereConditions(db, filters)

  // Apply only the necessary joins (not for filtering - we use subqueries for that)
  let query = qb
    .leftJoin(images, eq(books.coverImage, images.id))
    .leftJoin(publishers, eq(books.publisher, publishers.id))

  // Apply where conditions
  if (where.length > 0) {
    query = query.where(and(...where))
  }

  return query
}

export function buildWhereConditions(
  db: Drizzle,
  input: Omit<FetchBooksInput, 'page' | 'perPage' | 'sort'>
): SQL[] {
  const where: SQL[] = []

  // Status filter
  const statusFilter = wrapArray(input.status || 'published')
  if (statusFilter.length > 0) {
    where.push(inArray(books.status, statusFilter))
  }

  // Submitter filter
  if (input.submitterId) {
    where.push(eq(books.submitter, input.submitterId))
  }

  // Tags filter - use subquery to avoid joins
  if (input.tags?.length) {
    const sq = db
      .select({ bookId: books_rels.parent })
      .from(books_rels)
      .innerJoin(tags, eq(books_rels.tagsID, tags.id))
      .where(and(eq(books_rels.path, 'tags'), inArray(tags.slug, input.tags)))
    where.push(inArray(books.id, sq))
  }

  // Profile filter - use subquery for authors or contributors
  if (input.profile) {
    const authorsSq = db
      .select({ bookId: books_rels.parent })
      .from(books_rels)
      .innerJoin(profiles, eq(books_rels.profilesID, profiles.id))
      .where(
        and(eq(books_rels.path, 'authors'), eq(profiles.slug, input.profile))
      )

    const contributorsSq = db
      .select({ bookId: books_contributions._parentID })
      .from(books_contributions)
      .innerJoin(profiles, eq(books_contributions.profile, profiles.id))
      .where(eq(profiles.slug, input.profile))

    // Combine with OR - book must be in either subquery
    where.push(
      or(inArray(books.id, authorsSq), inArray(books.id, contributorsSq))!
    )
  }

  // Publisher filter
  if (input.publisherSlug) {
    where.push(eq(publishers.slug, input.publisherSlug))
  }

  // Page count filter
  if (input.pageCount) {
    const pageFilter = fetchBooksPageFilters.find(
      (f) => f.value === input.pageCount
    )
    if (pageFilter) {
      where.push(
        and(gte(books.pages, pageFilter.min), lte(books.pages, pageFilter.max))!
      )
    }
  }

  // Release year filter
  if (input.releaseYear) {
    where.push(
      sql`EXTRACT(year FROM ${books.releaseDate}) = ${input.releaseYear}`
    )
  }

  // Color filter - use subquery with actual color matching
  if (input.color) {
    const colorCondition = colorMatchCondition(input.color)
    where.push(
      sql`${books.id} IN (
        SELECT ${books_palette._parentID}
        FROM ${books_palette}
        WHERE ${colorCondition}
      )`
    )
  }

  // Search filter - uses pre-computed searchText field
  // This field contains: title, subtitle, publisher name, tag names, author names, contributor names
  if (input.search?.trim()) {
    const searchTerm = `%${input.search.trim()}%`
    where.push(sql`${books.searchText} ILIKE ${searchTerm}`)
  }

  return where
}

export function getSortExpression(
  sortKey: BookSort,
  hasColorFilter?: NamedColor | number[]
): SQL {
  const actualSort = hasColorFilter ? 'color' : sortKey || 'releaseDate'

  switch (actualSort) {
    case 'releaseDate':
      return sql`${books.releaseDate} DESC NULLS LAST`
    case 'createdAt':
      return sql`${books.createdAt} DESC NULLS LAST`
    case 'title':
      return sql`${books.title} ASC NULLS LAST`
    case 'color':
      // Color sorting will be handled by the color matching lateral join
      return sql`color_match DESC NULLS LAST`
    case 'random':
      return sql`RANDOM()`
  }
}

import { wrapArray } from '@books-about-food/shared/utils/array'
import { Hsl } from '@books-about-food/shared/utils/types'
import {
  SQL,
  and,
  countDistinct,
  eq,
  getTableColumns,
  gte,
  inArray,
  lte,
  or,
  sql
} from '@payloadcms/db-postgres/drizzle'
import { PgSelect } from '@payloadcms/db-postgres/drizzle/pg-core'
import { BasePayload } from 'payload'
import { Book } from 'src/core/models/book'
import { Service } from 'src/core/services/base'
import { Book as PayloadBook } from 'src/payload/payload-types'
import {
  books,
  books_contributions,
  books_palette,
  books_rels,
  enum_books_status,
  images,
  jobs,
  profiles,
  publishers,
  tags
} from 'src/payload/schema'
import { z } from 'zod'
import { array, arrayOrSingle, paginationInput } from '../utils/inputs'
import { NamedColor, OddColors } from './colors'
import {
  FetchBooksPageFilters,
  fetchBooksPageFilterValues,
  fetchBooksPageFilters
} from './filters'

type Drizzle = (typeof BasePayload)['prototype']['db']['drizzle']
type BookRow = Awaited<ReturnType<typeof selectBooks>>[0]
type AuthorsMap = Awaited<ReturnType<typeof fetchAuthorsForBooks>>
type ContributionsMap = Awaited<ReturnType<typeof fetchContributionsForBooks>>
type PaletteMap = Awaited<ReturnType<typeof fetchPaletteForBooks>>

const validator = z.object({
  sort: z
    .enum(['releaseDate', 'createdAt', 'title', 'color', 'random'])
    .optional(),
  tags: array(z.string()).optional(),
  search: z.string().optional(),
  profile: z.string().optional(),
  status: arrayOrSingle(z.enum(enum_books_status.enumValues)).optional(),
  submitterId: z.string().optional(),
  publisherSlug: z.string().optional(),
  color: z.enum(NamedColor).or(array(z.coerce.number())).optional(),
  releaseYear: z.number().optional(),
  pageCount: z
    .custom<FetchBooksPageFilters>((key) => {
      return fetchBooksPageFilterValues.includes(key as FetchBooksPageFilters)
    })
    .optional(),
  ...paginationInput.shape
})

export type FetchBooksInput = z.output<typeof validator>
export type FetchBooksOutput = Awaited<ReturnType<(typeof fetchBooks)['call']>>
type BookSort = FetchBooksInput['sort']

export const fetchBooks = new Service(
  validator.optional(),
  async (input = {}, { payload }) => {
    const db = payload.db.drizzle
    const {
      page = 0,
      perPage = 23,
      sort: sortKey = 'releaseDate',
      ...filters
    } = input

    // Get count with filters applied
    const countResult = await withFiltersAndJoins(
      db,
      db
        .select({ count: countDistinct(books.id) })
        .from(books)
        .$dynamic(),
      filters
    )

    // Get paginated books with filters applied
    const offset = perPage === 'all' ? 0 : page * perPage
    const limit = perPage === 'all' ? undefined : perPage

    let selectQuery = selectBooks(db, filters, sortKey)
      .orderBy(getSortExpression(sortKey, filters.color))
      .offset(offset)

    if (limit) {
      selectQuery = selectQuery.limit(limit)
    }

    const results = await selectQuery

    // If no books, return early
    if (results.length === 0) {
      return {
        books: [],
        total: 0,
        perPage:
          input.perPage === 'all' ? ('all' as const) : input.perPage || 23
      }
    }

    // Fetch related data for all books
    const bookIds = results.map((r) => r.id)
    const [authorsMap, contributionsMap, paletteMap] = await Promise.all([
      fetchAuthorsForBooks(db, bookIds),
      fetchContributionsForBooks(db, bookIds),
      fetchPaletteForBooks(db, bookIds)
    ])

    const total = Number(countResult[0].count)
    const perPageResult =
      input.perPage === 'all' ? ('all' as const) : input.perPage || 23

    return {
      books: results.map((row) =>
        transformToBook(row, authorsMap, contributionsMap, paletteMap)
      ),
      total,
      perPage: perPageResult
    }
  },
  { cache: 'fetch-books' }
)

function selectBooks(
  db: Drizzle,
  filters: Exclude<FetchBooksInput, 'page' | 'perPage' | 'sort'>,
  sortKey: BookSort
) {
  const {
    publisher: _p,
    submitter: _s,
    coverImage: _ci,
    ...bookCols
  } = getTableColumns(books)

  return withFiltersAndJoins(
    db,
    db
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
      .$dynamic(),
    filters
  )
}

function withFiltersAndJoins<T extends PgSelect>(
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

function buildWhereConditions(
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

function getSortExpression(
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

// Fetch authors for multiple books
async function fetchAuthorsForBooks(db: Drizzle, bookIds: string[]) {
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

// Fetch contributions for multiple books
async function fetchContributionsForBooks(db: Drizzle, bookIds: string[]) {
  const contributionsData = await db
    .select({
      bookId: books_contributions._parentID,
      id: books_contributions.id,
      order: books_contributions._order,
      profile: profileColumns,
      job: getTableColumns(jobs)
    })
    .from(books_contributions)
    .innerJoin(profiles, eq(books_contributions.profile, profiles.id))
    .innerJoin(images, eq(profiles.avatar, images.id))
    .innerJoin(jobs, eq(books_contributions.job, jobs.id))
    .where(inArray(books_contributions._parentID, bookIds))
    .orderBy(books_contributions._order)

  // Group by book ID and reshape to match expected format
  type ContributionRow = (typeof contributionsData)[0]
  const contributionsMap = new Map<string, ContributionRow[]>()

  for (const row of contributionsData) {
    const existing = contributionsMap.get(row.bookId) || []
    existing.push(row)
    contributionsMap.set(row.bookId, existing)
  }

  return contributionsMap
}

// Fetch palette for multiple books
async function fetchPaletteForBooks(db: Drizzle, bookIds: string[]) {
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

function transformToBook(
  row: BookRow,
  authorsMap: AuthorsMap,
  contributionsMap: ContributionsMap,
  paletteMap: PaletteMap
): Book {
  // Get related data for this book
  const authors = authorsMap.get(row.id) || []
  const contributions = contributionsMap.get(row.id) || []
  const palette = paletteMap.get(row.id) || []

  // Transform the raw database row to PayloadBook
  const bookData: PayloadBook = {
    ...row,
    backgroundColor: toHsl(row.backgroundColor),
    authors,
    contributions,
    palette
  }

  return new Book(bookData)
}

/** Gets relative radius for a hue considering visual perception of breadth of color */
function hueRadius(h: number) {
  if (h < 10) return 20 // red to orange
  if (h < 85) return 12 // orange to yellow
  if (h < 170) return 20 // yellow to green
  if (h < 215) return 12 // green to cyan
  if (h < 280) return 20 // cyan to blue
  return 12
}

function namedColorQuery(color: NamedColor) {
  switch (color) {
    case NamedColor.white:
      return sql`(${books_palette.color} ->> 'l')::decimal > 90`
    case NamedColor.black:
      return sql`(${books_palette.color} ->> 'l')::decimal < 10`
    case NamedColor.brown:
      return sql`(${books_palette.color} ->> 'h')::decimal between 10 and 35
      and (${books_palette.color} ->> 's')::decimal > 35
      and (${books_palette.color} ->> 'l')::decimal between 8 and 40`
    case NamedColor.gray:
      return sql`(${books_palette.color} ->> 's')::decimal < 15
      and (${books_palette.color} ->> 'l')::decimal between 25 and 70`
    default:
      return sql`(${sql.raw(namedColorToHueBand(color).map(hueBoundToSql).join(' or '))})
      and (${books_palette.color} ->> 's')::decimal > 40
      and (${books_palette.color} ->> 'l')::decimal between 20 and 70`
  }
}

function hueBoundToSql([lower, upper]: [number, number]) {
  // Note: Used within sql.raw() context, so must return plain string
  // The "color" column reference works in the subquery context
  return `("color" ->> 'h')::decimal between ${lower} and ${upper}`
}

function namedColorToHueBand(
  color: Exclude<NamedColor, OddColors>
): [number, number][] {
  switch (color) {
    case NamedColor.red:
      return [
        [0, 10],
        [331, 360]
      ]
    case NamedColor.orange:
      return [[11, 35]]
    case NamedColor.yellow:
      return [[36, 70]]
    case NamedColor.lime:
      return [[71, 105]]
    case NamedColor.green:
      return [[106, 145]]
    case NamedColor.cyan:
      return [[146, 195]]
    case NamedColor.blue:
      return [[196, 240]]
    case NamedColor.purple:
      return [[241, 280]]
    case NamedColor.pink:
      return [[281, 330]]
  }
}

function toHsl(color: unknown) {
  return z
    .object({ h: z.number(), s: z.number(), l: z.number() })
    .parse(color) as Hsl
}

/**
 * Generate color match SQL for filtering and scoring
 * Returns SQL condition that matches palette colors against the target color
 */
function colorMatchCondition(color: NamedColor | number[]): SQL {
  // If it's a named color, use the predefined query
  if (typeof color === 'string') return namedColorQuery(color)

  // For HSL array [h, s, l], calculate distance
  const [targetH, targetS, targetL] = color
  const radius = hueRadius(targetH)

  // Calculate hue distance with wraparound
  // Use LEAST to get minimum distance considering wraparound at 360
  return sql`
    LEAST(
      ABS((${books_palette.color} ->> 'h')::decimal - ${targetH}),
      360 - ABS((${books_palette.color} ->> 'h')::decimal - ${targetH})
    ) <= ${radius}
    AND ABS((${books_palette.color} ->> 's')::decimal - ${targetS}) <= 35
    AND ABS((${books_palette.color} ->> 'l')::decimal - ${targetL}) <= 35
  `
}

/**
 * Generate color match score SQL
 * Higher score = better match (inverse distance formula: 1.0 / (1.0 + distance²))
 */
function colorMatchScore(color: NamedColor | number[]): SQL {
  // For named colors, return 1 if match, 0 if not (binary)
  if (typeof color === 'string') {
    return sql`CASE WHEN ${namedColorQuery(color)} THEN 1 ELSE 0 END`
  }

  // For HSL array, calculate distance (lower = better match)
  const [targetH, targetS, targetL] = color
  return sql`
    1.0 / (1.0 +
      POWER(LEAST(
        ABS((${books_palette.color} ->> 'h')::decimal - ${targetH}),
        360 - ABS((${books_palette.color} ->> 'h')::decimal - ${targetH})
      ), 2) +
      POWER(ABS((${books_palette.color} ->> 's')::decimal - ${targetS}), 2) / 100.0 +
      POWER(ABS((${books_palette.color} ->> 'l')::decimal - ${targetL}), 2) / 100.0
    )
  `
}

const imageColumns = {
  id: images.id,
  url: images.url,
  filename: images.filename,
  mimeType: images.mimeType,
  filesize: images.filesize,
  width: images.width,
  height: images.height,
  placeholderUrl: images.placeholderUrl,
  prefix: images.prefix,
  createdAt: images.createdAt,
  updatedAt: images.updatedAt
}

const profileColumns = {
  ...getTableColumns(profiles),
  avatar: imageColumns
}

import { Service } from '@books-about-food/core/services/base'
import prisma, { BookStatus, Prisma } from '@books-about-food/database'
import { wrapArray } from '@books-about-food/shared/utils/array'
import { z } from 'zod'
import { array, arrayOrSingle, dbEnum, paginationInput } from '../utils/inputs'
import { NamedColor, OddColors, namedHueMap } from './colors'
import {
  FetchBooksPageFilters,
  fetchBooksPageFilterValues,
  fetchBooksPageFilters
} from './filters'
import { bookJoin, bookSelect, queryBooks } from './sql-helpers'

const { sql, join, empty, raw } = Prisma

const validator = z.object({
  sort: z.enum(['releaseDate', 'createdAt', 'color']).optional(),
  tags: array(z.string()).optional(),
  search: z.string().optional(),
  profile: z.string().optional(),
  status: arrayOrSingle(dbEnum(BookStatus)).optional(),
  submitterId: z.string().optional(),
  publisherSlug: z.string().optional(),
  color: z.nativeEnum(NamedColor).or(array(z.coerce.number())).optional(),
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

export const fetchBooks = new Service(validator, async (input = {}) => {
  const { query, perPage } = baseQuery(input)

  const [books, filteredCount, total] = await Promise.all([
    query,
    prisma.$queryRaw<{ count: number }[]>(countQuery(input)),
    prisma.book.count()
  ])
  const filteredTotal = Number(filteredCount[0].count)

  return { books, filteredTotal, total, perPage }
})

function countQuery(input: FetchBooksInput) {
  const filters = sqlFilters(input)

  return sql`select count(distinct books.id) from books
    ${filters}`
}

function baseQuery({
  page = 0,
  perPage = 18,
  sort: sortKey = 'releaseDate',
  ...input
}: FetchBooksInput) {
  const filters = sqlFilters(input)
  const sort = sortQuery(input.color ? 'color' : sortKey)
  const limit = perPage === 'all' ? empty : sql`limit ${perPage}`
  const offset = perPage === 'all' ? 0 : page * perPage

  const query = queryBooks`
    select distinct
      ${bookSelect},
      ${sort} as sort
    from books
    ${filters}
    group by books.id, cover_image.id, sort
    order by sort desc nulls last
    ${limit}
    offset ${offset}`

  return { query, perPage }
}

function sqlFilters(input: FetchBooksInput) {
  const whereArray = whereQuery(input)
  const where = join(whereArray, ' and ')
  return sql`
    left outer join _books_tags on _books_tags."A" = books.id
    left outer join tags on _books_tags."B" = tags.id
    ${bookJoin}
    ${colorJoin(input.color)}
    where ${where}`
}

function whereQuery({
  tags,
  profile,
  status = 'published' as const,
  submitterId,
  publisherSlug,
  pageCount,
  color,
  search
}: FetchBooksInput) {
  const where: Prisma.Sql[] = []
  where.push(sql`status::text in (${join(wrapArray(status))})`)
  if (submitterId) where.push(sql`submitter_id::text = ${submitterId}`)
  if (tags && tags.length > 0) where.push(sql`tags.slug in (${join(tags)})`)
  if (profile) where.push(profileQuery(profile))
  if (pageCount) where.push(pageCountQuery(pageCount))
  if (publisherSlug) where.push(sql`publishers.slug = ${publisherSlug}`)
  if (color?.length) where.push(sql`matched_palette.color is not null`)

  const searchWhere = searchQuery(search)
  if (searchWhere) where.push(searchWhere)
  return where
}

function profileQuery(profile?: string) {
  if (!profile) return empty
  return sql`(contributions.profile ->> 'slug' = ${profile} or authors.slug = ${profile})`
}

function pageCountQuery(pageCount: FetchBooksPageFilters) {
  const pageCountFilter = fetchBooksPageFilters.find(
    (f) => f.value === pageCount
  )
  if (pageCountFilter) {
    const { min, max } = pageCountFilter
    return sql`between ${min} and ${max}`
  }
  return empty
}

function searchQuery(search?: string) {
  const contains = search?.trim()
  const hasSearch = (contains && contains.length > 0) || undefined

  if (!hasSearch) return

  return sql`concat_ws(' ', books.title, books.subtitle, publishers.name, contributions.profile ->> 'name', tags.name) ilike ${`%${contains}%`}`
}

function specificColorJoin(color: number[]) {
  const [h, s, l] = color

  return sql`left outer join lateral (
      select
        abs(${h}::int - (c.color ->> 'h')::decimal) * -1 as color
      from (
        select jsonb_array_elements(books.palette) color from books b
        where b.id = books.id
      ) c
      where abs(${h}::int - (c.color ->> 'h')::decimal) < ${hueRadius(h)}::int
        and abs(${s}::int - (c.color ->> 's')::decimal) < 20
        and abs(${l}::int - (c.color ->> 'l')::decimal) < 15
      limit 1
    ) matched_palette on true`
}

function namedColorJoin(color: NamedColor) {
  return sql`left outer join lateral (
      select abs(${
        namedHueMap[color]
      }::int - (c.color ->> 'h')::decimal) * -1 as color
      from (
        select jsonb_array_elements(books.palette) color from books b
        where b.id = books.id
      ) c
      where ${raw(namedColorQuery(color))}
      limit 1
    ) matched_palette on true`
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
      return `(c.color ->> 'l')::decimal > 90`
    case NamedColor.black:
      return `(c.color ->> 'l')::decimal < 10`
    case NamedColor.brown:
      return `(c.color ->> 'h')::decimal between 10 and 35
      and (c.color ->> 's')::decimal > 35
      and (c.color ->> 'l')::decimal between 8 and 40`
    case NamedColor.gray:
      return `(c.color ->> 's')::decimal < 15
      and (c.color ->> 'l')::decimal between 25 and 70`
    default:
      return `(${namedColorToHueBand(color).map(hueBoundToSql).join(' or ')})
      and (c.color ->> 's')::decimal > 40
      and (c.color ->> 'l')::decimal between 20 and 70`
  }
}

function hueBoundToSql([lower, upper]: [number, number]) {
  return `(c.color ->> 'h')::decimal between ${lower} and ${upper}`
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

function colorJoin(color?: NamedColor | number[]) {
  if (typeof color === 'string') return namedColorJoin(color)
  if (color?.length) return specificColorJoin(color)
  return sql`left outer join lateral (
    select (b.palette -> 0 ->> 'h')::decimal as color from books b
    where b.id = books.id
  ) matched_palette on true`
}

function sortQuery(sort?: BookSort) {
  switch (sort) {
    case 'releaseDate':
      return raw('books.release_date')
    case 'createdAt':
      return raw('books.created_at')
    case 'color':
      return raw('matched_palette.color')
    default:
      return raw('books.release_date')
  }
}

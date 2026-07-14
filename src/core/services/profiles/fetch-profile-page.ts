import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  isNotNull,
  ne,
  or,
  SQL,
  sql
} from '@payloadcms/db-postgres/drizzle'
import { BasePayload } from 'payload'
import {
  books,
  books_contributions,
  books_rels,
  locations,
  profiles,
  profiles_rels
} from 'src/payload/schema'

type ProfilePageQuery = {
  page: number
  perPage: number | 'all'
  userId?: string
  locations?: string[]
  jobs?: string[]
  sort: 'name' | 'trending'
  search?: string
  onlyPublished: boolean
  withAvatar?: boolean
}

export async function fetchProfilePageIds(
  payload: BasePayload,
  query: ProfilePageQuery
) {
  const db = payload.db.drizzle
  const conditions: SQL[] = [ne(profiles.name, '')]

  if (query.userId) conditions.push(eq(profiles.user, query.userId))
  if (query.withAvatar) conditions.push(isNotNull(profiles.avatar))

  if (query.search) {
    const search = `%${query.search}%`
    conditions.push(
      or(ilike(profiles.name, search), ilike(profiles.jobTitle, search))!
    )
  }

  if (query.locations?.length) {
    conditions.push(hasLocation(db, query.locations))
  }

  if (query.jobs?.length) {
    const roleConditions: SQL[] = []
    const contributionJobs = query.jobs.filter((job) => job !== 'author')

    if (query.jobs.includes('author')) {
      roleConditions.push(hasAuthoredBook(db, query.onlyPublished))
    }
    if (contributionJobs.length) {
      roleConditions.push(
        hasContributedToBook(db, query.onlyPublished, contributionJobs)
      )
    }

    conditions.push(or(...roleConditions)!)
  } else if (query.onlyPublished) {
    conditions.push(hasPublishedWork(db))
  }

  const where = and(...conditions)
  const order =
    query.sort === 'name'
      ? [asc(profiles.name), asc(profiles.id)]
      : [desc(profiles.mostRecentlyPublishedOn), asc(profiles.id)]

  const pageQuery = db
    .select({ id: profiles.id })
    .from(profiles)
    .where(where)
    .orderBy(...order)
    .$dynamic()

  if (query.perPage !== 'all') {
    pageQuery.limit(query.perPage).offset(query.page * query.perPage)
  }

  const [[{ total }], rows] = await Promise.all([
    db.select({ total: count() }).from(profiles).where(where),
    pageQuery
  ])

  return { ids: rows.map(({ id }) => id), total }
}

export function hasPublishedWork(db: BasePayload['db']['drizzle']) {
  return or(hasAuthoredBook(db, true), hasContributedToBook(db, true))!
}

function hasAuthoredBook(
  db: BasePayload['db']['drizzle'],
  onlyPublished: boolean
) {
  const conditions = [
    eq(books_rels.profilesID, profiles.id),
    eq(books_rels.path, 'authors')
  ]
  if (onlyPublished) conditions.push(eq(books.status, 'published'))

  return exists(
    db
      .select({ id: books.id })
      .from(books_rels)
      .innerJoin(books, eq(books.id, books_rels.parent))
      .where(and(...conditions))
  )
}

function hasContributedToBook(
  db: BasePayload['db']['drizzle'],
  onlyPublished: boolean,
  jobs: string[] = []
) {
  const conditions = [eq(books_contributions.profile, profiles.id)]
  if (onlyPublished) conditions.push(eq(books.status, 'published'))
  if (jobs.length) conditions.push(inArray(books_contributions.job, jobs))

  return exists(
    db
      .select({ id: books.id })
      .from(books_contributions)
      .innerJoin(books, eq(books.id, books_contributions._parentID))
      .where(and(...conditions))
  )
}

function hasLocation(db: BasePayload['db']['drizzle'], filters: string[]) {
  const slugs: string[] = []
  const countries: string[] = []
  const regions: string[] = []

  for (const filter of filters) {
    const [type, value] = filter.split(':', 2)
    if (type === 'country') countries.push(value)
    else if (type === 'region') regions.push(value)
    else slugs.push(filter)
  }

  const matches: SQL[] = []
  if (slugs.length) matches.push(inArray(locations.slug, slugs))
  if (countries.length) matches.push(inArray(locations.country, countries))
  if (regions.length) matches.push(inArray(locations.region, regions))

  return exists(
    db
      .select({ value: sql`1` })
      .from(profiles_rels)
      .innerJoin(locations, eq(locations.id, profiles_rels.locationsID))
      .where(
        and(
          eq(profiles_rels.parent, profiles.id),
          eq(profiles_rels.path, 'locations'),
          or(...matches)
        )
      )
  )
}

import { Profile } from 'core/models/profile'
import { Service } from 'core/services/base'
import prisma, { Prisma, cacheStrategy } from 'database'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import { array, paginationInput } from '../utils/inputs'

const authorFilter = (onlyAuthors?: boolean): Prisma.ProfileWhereInput => {
  switch (onlyAuthors) {
    case true:
      return { authoredBooks: { some: {} } }
    case false:
      return { contributions: { some: {} } }
    default:
      return {}
  }
}

export type FetchProfilesInput = NonNullable<
  z.infer<(typeof fetchProfiles)['input']>
>
export type FetchProfilesOutput = Awaited<
  ReturnType<(typeof fetchProfiles)['call']>
>

export const fetchProfiles = new Service(
  z
    .object({
      sort: z.enum(['name', 'trending']).optional(),
      onlyAuthors: z.boolean().optional(),
      search: z.string().optional(),
      jobs: array(z.string()).optional(),
      onlyPublished: z.boolean().optional()
    })
    .merge(paginationInput),
  async ({
    page = 0,
    perPage = 21,
    jobs,
    onlyAuthors,
    sort = 'name',
    search,
    onlyPublished = true
  } = {}) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const baseWhere = authorFilter(onlyAuthors)
    const hasJob = (jobs && jobs.length > 0) || undefined
    const where: Prisma.ProfileWhereInput = {
      AND: [
        baseWhere,
        hasSearch
          ? {
              OR: [
                { name: { contains, mode: 'insensitive' } },
                { jobTitle: { contains, mode: 'insensitive' } }
              ]
            }
          : {},
        {
          OR: hasJob && [
            { contributions: { some: { job: { id: { in: jobs } } } } }
          ]
        },
        onlyPublished
          ? {
              OR: [
                { authoredBooks: { some: { status: 'published' } } },
                { contributions: { some: { book: { status: 'published' } } } }
              ]
            }
          : {}
      ]
    }

    const orderBy: Prisma.ProfileOrderByWithRelationAndSearchRelevanceInput =
      sort === 'name'
        ? { name: 'asc' }
        : { mostRecentlyPublishedOn: { sort: 'desc', nulls: 'last' } }

    const [raw, total, filteredTotal] = await Promise.all([
      prisma.profile.findMany({
        orderBy,
        where,
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page,
        include: profileIncludes,
        cacheStrategy
      }),
      prisma.profile.count({ where: baseWhere, cacheStrategy }),
      prisma.profile.count({ where, cacheStrategy })
    ])

    const profiles = raw.map((profile) => new Profile(profile))

    return { profiles, total, filteredTotal, perPage }
  }
)

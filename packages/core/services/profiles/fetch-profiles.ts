import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
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

export const FETCH_PROFILES_ONLY_PUBLISHED_QUERY = {
  OR: [
    { authoredBooks: { some: { status: 'published' as const } } },
    { contributions: { some: { book: { status: 'published' as const } } } }
  ]
}

export type FetchProfilesInput = NonNullable<
  z.infer<(typeof fetchProfiles)['input']>
>
export type FetchProfilesOutput = Awaited<
  ReturnType<(typeof fetchProfiles)['call']>
>

export const fetchProfiles = new Service(
  z.object({
    userId: z.string().optional(),
    sort: z.enum(['name', 'trending']).optional(),
    onlyAuthors: z.boolean().optional(),
    search: z.string().optional(),
    jobs: array(z.string()).optional(),
    onlyPublished: z.boolean().optional(),
    withAvatar: z.boolean().optional(),
    ...paginationInput.shape
  }),
  async ({
    page = 0,
    perPage = 21,
    userId,
    jobs,
    onlyAuthors,
    sort = 'name',
    search,
    onlyPublished = true,
    withAvatar
  } = {}) => {
    const contains = search?.trim()
    const hasSearch = (contains && contains.length > 0) || undefined
    const baseWhere = authorFilter(onlyAuthors)
    const hasJob = (jobs && jobs.length > 0) || undefined
    const userIdFilter = userId ? { userId: userId } : {}
    const where: Prisma.ProfileWhereInput = {
      AND: [
        baseWhere,
        { name: { not: '' } },
        userIdFilter,
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
        onlyPublished ? FETCH_PROFILES_ONLY_PUBLISHED_QUERY : {},
        withAvatar ? { avatar: { isNot: null } } : {}
      ]
    }

    const orderBy: Prisma.ProfileOrderByWithRelationInput =
      sort === 'name'
        ? { name: 'asc' }
        : { mostRecentlyPublishedOn: { sort: 'desc', nulls: 'last' } }

    const [raw, total, filteredTotal] = await Promise.all([
      prisma.profile.findMany({
        orderBy,
        where,
        take: perPage === 'all' ? undefined : perPage,
        skip: perPage === 'all' ? 0 : perPage * page,
        include: profileIncludes
      }),
      prisma.profile.count({ where: baseWhere }),
      prisma.profile.count({ where })
    ])

    const profiles = raw.map((profile) => new Profile(profile))

    return { profiles, total, filteredTotal, perPage }
  },
  { cache: 'fetch-profiles' }
)

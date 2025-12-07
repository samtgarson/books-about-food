import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import { array, paginationInput } from '../utils/inputs'

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
    locationIds: array(z.string()).optional(),
    sort: z.enum(['name', 'trending']).optional(),
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
    locationIds,
    jobs,
    sort = 'name',
    search,
    onlyPublished = true,
    withAvatar
  }) => {
    const jobFilter = createJobFilter(jobs)
    const userIdFilter = userId ? { userId: userId } : {}
    const locationFilter =
      locationIds && locationIds.length > 0
        ? { locations: { some: { id: { in: locationIds } } } }
        : {}
    const searchFilter = createSearchFilter(search)

    const where: Prisma.ProfileWhereInput = {
      AND: [
        { name: { not: '' } },
        userIdFilter,
        locationFilter,
        searchFilter,
        jobFilter,
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
      prisma.profile.count(),
      prisma.profile.count({ where })
    ])

    const profiles = raw.map((profile) => new Profile(profile))

    return { profiles, total, filteredTotal, perPage }
  },
  { cache: 'fetch-profiles' }
)

function createJobFilter(jobs: string[] | undefined): Prisma.ProfileWhereInput {
  const jobFilter: Prisma.ProfileWhereInput['OR'] = []
  const hasAuthor = jobs?.includes('author')
  const jobsWithoutAuthor = jobs?.filter((job) => job !== 'author') ?? []

  if (jobsWithoutAuthor.length > 0) {
    jobFilter.push({
      contributions: { some: { job: { id: { in: jobs } } } }
    })
  }

  if (hasAuthor) jobFilter.push({ authoredBooks: { some: {} } })

  if (!jobFilter.length) return {}
  return { OR: jobFilter }
}

function createSearchFilter(search?: string): Prisma.ProfileWhereInput {
  const contains = search?.trim()
  if (!contains || contains.length === 0) return {}
  return {
    OR: [
      { name: { contains, mode: 'insensitive' } },
      { jobTitle: { contains, mode: 'insensitive' } }
    ]
  }
}

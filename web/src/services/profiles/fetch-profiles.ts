import prisma, { Prisma } from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'

const authorFilter = (onlyAuthors?: boolean): Prisma.ProfileWhereInput => {
  switch (onlyAuthors) {
    case true:
      return { contributions: { some: { job: { name: 'Author' } } } }
    case false:
      return { contributions: { none: { job: { name: 'Author' } } } }
    default:
      return {}
  }
}

export type FetchProfilesInput = NonNullable<
  z.infer<typeof fetchProfiles['input']>
>
export type FetchProfilesOutput = Awaited<
  ReturnType<typeof fetchProfiles['call']>
>
export const fetchProfiles = new Service(
  z.object({
    page: z.number().optional(),
    perPage: z.number().optional(),
    sort: z.enum(['name', 'trending']).optional(),
    onlyAuthors: z.boolean().optional(),
    search: z.string().optional(),
    jobs: z.string().array().optional()
  }),
  async ({
    page = 0,
    perPage = 21,
    jobs,
    onlyAuthors,
    sort = 'name',
    search
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
        }
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
        include: profileIncludes
      }),
      prisma.profile.count({ where: baseWhere }),
      prisma.profile.count({ where })
    ])

    const profiles = raw.map((profile) => new Profile(profile))

    return { profiles, total, filteredTotal, perPage }
  }
)

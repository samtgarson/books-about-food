import prisma, { Prisma } from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'

const authorFilter = (onlyAuthors?: boolean): Prisma.ProfileWhereInput => {
  switch (onlyAuthors) {
    case true:
      return { jobs: { some: { name: 'Author' } } }
    case false:
      return { jobs: { none: { name: 'Author' } } }
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
    onlyAuthors: z.boolean().optional(),
    jobs: z.string().array().optional()
  }),
  async ({ page = 0, perPage = 21, jobs, onlyAuthors } = {}) => {
    const baseWhere = authorFilter(onlyAuthors)
    const hasJob = (jobs && jobs.length > 0) || undefined
    const where: Prisma.ProfileWhereInput = {
      AND: [
        baseWhere,
        {
          OR: hasJob && [
            { contributions: { some: { job: { id: { in: jobs } } } } },
            { jobs: { some: { id: { in: jobs } } } }
          ]
        }
      ]
    }

    const [raw, total, filteredTotal] = await Promise.all([
      prisma.profile.findMany({
        orderBy: { name: 'asc' },
        where,
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page,
        include: profileIncludes.include
      }),
      prisma.profile.count({ where: baseWhere }),
      prisma.profile.count({ where })
    ])

    const profiles = raw.map((profile) => new Profile(profile))

    return { profiles, total, filteredTotal, perPage }
  }
)

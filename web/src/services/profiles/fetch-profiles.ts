import prisma, { Prisma } from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

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
export const fetchProfiles = new Service(
  z.object({
    page: z.number().optional(),
    perPage: z.number().optional(),
    onlyAuthors: z.boolean().optional(),
    jobs: z.string().array().optional()
  }),
  async ({ page = 0, perPage = 20, jobs, onlyAuthors } = {}) => {
    const baseWhere = authorFilter(onlyAuthors)
    const hasJob = (jobs && jobs.length > 0) || undefined
    const where: Prisma.ProfileWhereInput = {
      AND: [baseWhere, { jobs: hasJob && { some: { id: { in: jobs } } } }]
    }

    const [profiles, total, filteredTotal] = await Promise.all([
      prisma.profile.findMany({
        orderBy: { name: 'asc' },
        where,
        take: perPage === 0 ? undefined : perPage,
        skip: perPage * page
      }),
      prisma.profile.count({ where: baseWhere }),
      prisma.profile.count({ where })
    ])

    return { profiles, total, filteredTotal, perPage }
  }
)

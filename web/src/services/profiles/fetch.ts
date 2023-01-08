import prisma, { Prisma } from 'database'

export type FetchProfilesOptions = {
  page?: number
  perPage?: number
  onlyAuthors?: boolean
  jobs?: string[]
}

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

export const fetchProfiles = async ({
  page = 0,
  perPage = 20,
  jobs,
  onlyAuthors
}: FetchProfilesOptions) => {
  const baseWhere = authorFilter(onlyAuthors)
  const hasJob = (jobs && jobs.length > 0) || undefined
  const where: Prisma.ProfileWhereInput = {
    AND: [baseWhere, { jobs: hasJob && { some: { name: { in: jobs } } } }]
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

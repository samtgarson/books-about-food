import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const fetchFeaturedJobs = new Service(
  z.undefined(),
  async () =>
    prisma.$queryRaw<{ id: string; name: string; count: string }[]>`
      select jobs.id, jobs.name, count(distinct contributions.profile_id)::text from jobs
      left outer join contributions on contributions.job_id = jobs.id
      where jobs.featured = true
      group by jobs.id
      order by jobs.name asc;
    `
)

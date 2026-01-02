import prisma from '@books-about-food/database'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export const fetchFeaturedJobs = new Service(
  z.undefined(),
  async (_input, _ctx) =>
    prisma.$queryRaw<{ id: string; name: string; count: string }[]>`
      select jobs.id, jobs.name, count(distinct contributions.profile_id)::text from jobs
      left outer join contributions on contributions.job_id = jobs.id
      where jobs.featured = true
      group by jobs.id
      order by jobs.name asc;
    `
)

import { countDistinct, eq } from '@payloadcms/db-postgres/drizzle'
import { Service } from 'src/core/services/base'
import { books_contributions, jobs } from 'src/payload/schema'
import { z } from 'zod'

export const fetchFeaturedJobs = new Service(
  z.undefined(),
  async (_input, { payload }) => {
    const db = payload.db.drizzle

    return db
      .select({
        id: jobs.id,
        name: jobs.name,
        count: countDistinct(books_contributions._parentID).as('count')
      })
      .from(jobs)
      .leftJoin(books_contributions, eq(books_contributions.job, jobs.id))
      .where(eq(jobs.featured, true))
      .groupBy(jobs.id)
      .orderBy(jobs.name)
  }
)

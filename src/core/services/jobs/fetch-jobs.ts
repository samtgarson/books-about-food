import { Where } from 'payload'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export const fetchJobs = new Service(
  z.object({ search: z.string().optional() }),
  async ({ search }, { payload }) => {
    const where: Where = {}

    if (search) {
      where.name = { contains: search }
    }

    const { docs } = await payload.find({
      collection: 'jobs',
      sort: 'name',
      where
    })

    return docs
  }
)

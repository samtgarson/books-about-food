import { Where } from 'payload'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export const fetchTags = new Service(
  z.object({ search: z.string().optional() }),
  async function ({ search }, { payload }) {
    const where: Where = {
      'group.adminOnly': { equals: false },
      'books.status': { equals: 'published' }
    }

    if (search) {
      where.name = { contains: search }
    }

    const { docs } = await payload.find({
      collection: 'tags',
      sort: 'name',
      where
    })

    return docs
  }
)

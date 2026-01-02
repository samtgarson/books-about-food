import { Where } from 'payload'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { PROFILE_DEPTH } from 'src/core/services/utils/payload-depth'
import { z } from 'zod'

export const fetchProfile = new Service(
  z.object({ onlyPublished: z.boolean().optional(), slug: z.string() }),
  async ({ slug, onlyPublished }, { payload }) => {
    const where: Where = { slug: { equals: slug } }

    if (onlyPublished) {
      where.or = [
        { 'authoredBooks.status': { equals: 'published' } },
        { 'contributions.book.status': { equals: 'published' } }
      ]
    }

    const { docs } = await payload.find({
      collection: 'profiles',
      where,
      limit: 1,
      depth: PROFILE_DEPTH
    })

    return docs[0] ? new Profile(docs[0]) : null
  }
)

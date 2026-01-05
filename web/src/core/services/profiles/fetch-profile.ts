import { JoinQuery, Where } from 'payload'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { z } from 'zod'
import { PROFILE_DEPTH } from '../utils/payload-depth'

export const fetchProfile = new Service(
  z.object({ onlyPublished: z.boolean().optional(), slug: z.string() }),
  async ({ slug, onlyPublished }, { payload }) => {
    const where: Where = { slug: { equals: slug } }
    const joins: JoinQuery<'profiles'> = {}

    if (onlyPublished) {
      joins.contributions = { where: { status: { equals: 'published' } } }
      where.or = [
        { 'authoredBooks.status': { equals: 'published' } },
        { authoredBooks: { exists: false } }
      ]
    }

    try {
      const { docs } = await payload.find({
        collection: 'profiles',
        where,
        limit: 1,
        depth: PROFILE_DEPTH,
        joins
      })

      return docs[0] ? new Profile(docs[0]) : null
    } catch (e) {
      console.log('Error fetching profile:', e)
      throw e
    }
  }
)

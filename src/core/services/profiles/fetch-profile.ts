import { and, eq } from '@payloadcms/db-postgres/drizzle'
import { Where } from 'payload'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { profiles } from 'src/payload/schema'
import { z } from 'zod'
import { PROFILE_DEPTH } from '../utils/payload-depth'
import { hasPublishedWork } from './fetch-profile-page'

export const fetchProfile = new Service(
  z.object({ onlyPublished: z.boolean().optional(), slug: z.string() }),
  async ({ slug, onlyPublished }, { payload }) => {
    const where: Where = { slug: { equals: slug } }

    if (onlyPublished) {
      const [publishedProfile] = await payload.db.drizzle
        .select({ id: profiles.id })
        .from(profiles)
        .where(
          and(eq(profiles.slug, slug), hasPublishedWork(payload.db.drizzle))
        )
        .limit(1)

      if (!publishedProfile) return null
      where.id = { equals: publishedProfile.id }
    }

    try {
      const { docs } = await payload.find({
        collection: 'profiles',
        where,
        limit: 1,
        depth: PROFILE_DEPTH
      })

      return docs[0] ? new Profile(docs[0]) : null
    } catch (e) {
      console.log('Error fetching profile:', e)
      throw e
    }
  }
)

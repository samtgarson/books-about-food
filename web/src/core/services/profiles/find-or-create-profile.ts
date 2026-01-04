import { slugify } from '@books-about-food/shared/utils/slugify'
import z from 'zod'
import { Profile } from '../../models/profile'
import { AuthedService } from '../base'
import { PROFILE_DEPTH } from '../utils/payload-depth'

export const findOrCreateProfile = new AuthedService(
  z.object({ name: z.string().trim() }),
  async function ({ name }, { payload, user }) {
    // Search for existing profiles with this name
    const { docs } = await payload.find({
      collection: 'profiles',
      where: { name: { equals: name } },
      depth: PROFILE_DEPTH,
      user
    })

    // If multiple matches, return undefined (ambiguous)
    if (docs.length > 1) return undefined
    if (docs.length === 1) return new Profile(docs[0])

    // Create new profile
    const created = await payload.create({
      collection: 'profiles',
      data: { name, slug: slugify(name) },
      depth: PROFILE_DEPTH,
      user
    })

    return new Profile(created)
  }
)

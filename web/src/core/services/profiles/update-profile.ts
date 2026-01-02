import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { Profile } from 'src/core/models/profile'
import { can } from 'src/core/policies'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'
import { findOrCreateLocation } from '../locations/find-or-create-location'
import { profileIncludes } from '../utils'
import { array } from '../utils/inputs'
import { fetchProfile } from './fetch-profile'

export type UpdateProfileInput = z.infer<typeof updateProfile.input>

const instagramHandle = /[a-zA-Z0-9._]+/

const locationInputSchema = z.object({
  placeId: z.string(),
  displayText: z.string()
})

export const updateProfile = new AuthedService(
  z.object({
    slug: z.string(),
    name: z.string().optional(),
    description: z.string().nullish(),
    jobTitle: z.string().nullish(),
    website: z.url().nullish(),
    instagram: z.string().regex(instagramHandle).nullish(),
    locations: array(locationInputSchema).nullish(),
    avatar: z.string().nullish(),
    hiddenCollaborators: array(z.string()).optional()
  }),
  async ({ slug, avatar, instagram, locations, ...data }, ctx) => {
    const { user } = ctx
    const { data: profile } = await fetchProfile.call({ slug }, ctx)
    if (profile && !can(user, profile).update) {
      throw new Error('You are not allowed to update this profile')
    }

    // Find or create locations and collect their IDs
    let locationIds: string[] | undefined
    if (locations !== undefined && locations !== null) {
      const locationResults = await Promise.all(
        locations.map((loc) => findOrCreateLocation.call(loc, ctx))
      )
      locationIds = locationResults.flatMap((r) => r.data?.id ?? [])
    }

    const updated = await prisma.profile.update({
      where: { slug },
      data: {
        ...data,
        instagram: normalizeHandles(instagram),
        slug: data.name ? slugify(data.name) : undefined,
        avatar: avatarProps(avatar),
        locations:
          locationIds !== undefined
            ? { set: locationIds.map((id) => ({ id })) }
            : undefined
      },
      include: profileIncludes
    })

    return new Profile(updated)
  }
)

function avatarProps(id?: string | null) {
  if (id === null) return { disconnect: true }
  if (id) return { connect: { id } }
  return undefined
}

function normalizeHandles(handle: string | null | undefined) {
  if (!handle) return handle
  if (handle.startsWith('@')) return handle.slice(1)
  return handle
}

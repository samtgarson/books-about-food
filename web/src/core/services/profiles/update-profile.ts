import { slugify } from '@books-about-food/shared/utils/slugify'
import { RequiredDataFromCollectionSlug } from 'payload'
import { Profile } from 'src/core/models/profile'
import { can } from 'src/core/policies'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'
import { findOrCreateLocation } from '../locations/find-or-create-location'
import { AppError } from '../utils/errors'
import { array } from '../utils/inputs'
import { PROFILE_DEPTH } from '../utils/payload-depth'
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
    const { payload, user } = ctx
    const { data: profile } = await fetchProfile.call({ slug }, ctx)
    if (!profile) throw new AppError('NotFound', 'Profile not found')
    if (!can(user, profile).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to update this profile'
      )
    }

    // Build update data
    const updateData: Partial<RequiredDataFromCollectionSlug<'profiles'>> = {
      ...data,
      instagram: normalizeHandles(instagram),
      slug: data.name ? slugify(data.name) : undefined
    }

    // Handle avatar (null = remove, string = set, undefined = no change)
    if (avatar === null) {
      updateData.avatar = null
    } else if (avatar) {
      updateData.avatar = avatar
    }

    // Handle locations
    // Find or create locations and collect their IDs
    if (locations !== undefined && locations !== null) {
      const locationResults = await Promise.all(
        locations.map((loc) => findOrCreateLocation.call(loc, ctx))
      )
      updateData.locations = locationResults.flatMap((r) => r.data?.id ?? [])
    }

    // Update profile
    const updated = await payload.update({
      collection: 'profiles',
      id: profile.id,
      data: updateData,
      depth: PROFILE_DEPTH,
      user
    })

    return new Profile(updated)
  }
)

function normalizeHandles(handle: string | null | undefined) {
  if (!handle) return handle
  if (handle.startsWith('@')) return handle.slice(1)
  return handle
}

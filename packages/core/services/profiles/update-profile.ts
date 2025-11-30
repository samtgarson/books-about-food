import { Profile } from '@books-about-food/core/models/profile'
import { can } from '@books-about-food/core/policies'
import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import { array } from '../utils/inputs'
import { fetchProfile } from './fetch-profile'

export type UpdateProfileInput = z.infer<typeof updateProfile.input>

const instagramHandle = /[a-zA-Z0-9._]+/

export const updateProfile = new AuthedService(
  z.object({
    slug: z.string(),
    name: z.string().optional(),
    description: z.string().nullish(),
    jobTitle: z.string().nullish(),
    website: z.url().nullish(),
    instagram: z.string().regex(instagramHandle).nullish(),
    location: z.string().nullish(),
    avatar: z.string().nullish(),
    hiddenCollaborators: array(z.string()).optional()
  }),
  async ({ slug, avatar, instagram, ...data }, user) => {
    const { data: profile } = await fetchProfile.call({ slug })
    if (profile && !can(user, profile).update) {
      throw new Error('You are not allowed to update this profile')
    }

    const updated = await prisma.profile.update({
      where: { slug },
      data: {
        ...data,
        instagram: normalizeHandles(instagram),
        slug: data.name ? slugify(data.name) : undefined,
        avatar: avatarProps(avatar)
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

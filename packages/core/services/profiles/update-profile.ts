import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import { array } from '../utils/inputs'

export type UpdateProfileInput = z.infer<typeof updateProfile.input>

const basicUrl =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/
const instagramHandle = /[a-zA-Z0-9._]+/

export const updateProfile = new Service(
  z.object({
    slug: z.string(),
    name: z.string().optional(),
    description: z.string().nullish(),
    jobTitle: z.string().nullish(),
    website: z.string().regex(basicUrl).nullish(),
    instagram: z.string().regex(instagramHandle).nullish(),
    location: z.string().nullish(),
    avatar: z.string().nullish(),
    hiddenCollaborators: array(z.string()).optional()
  }),
  async ({ slug, avatar, instagram, ...data } = {}, user) => {
    const profile = await prisma.profile.findUnique({ where: { slug } })
    if (profile?.userId !== user?.id && user?.role !== 'admin') {
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
  if (!handle) return undefined
  if (handle.startsWith('@')) return handle.slice(1)
  return handle
}

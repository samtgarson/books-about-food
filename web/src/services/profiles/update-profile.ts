import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'
import { Profile } from 'src/models/profile'

export type UpdateProfileInput = z.infer<typeof updateProfile.input>

const basicUrl =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/
const instagramHandle = /[a-zA-Z0-9._]+/

export const updateProfile = new Service(
  z.object({
    slug: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    jobTitle: z.string().optional(),
    website: z.string().regex(basicUrl).nullish(),
    instagram: z.string().regex(instagramHandle).nullish()
  }),
  async ({ slug, ...data } = {}, user) => {
    const profile = await prisma.profile.findUnique({ where: { slug } })
    if (profile?.userId !== user?.id && user?.role !== 'admin') {
      throw new Error('You are not allowed to update this profile')
    }

    const updated = await prisma.profile.update({
      where: { slug },
      data: {
        ...data,
        slug: data.name ? slugify(data.name) : undefined
      },
      include: profileIncludes
    })

    return new Profile(updated)
  }
)

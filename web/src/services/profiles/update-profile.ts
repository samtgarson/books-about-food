import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type UpdateProfileInput = z.infer<typeof updateProfile.input>

export const updateProfile = new Service(
  z.object({
    slug: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    jobTitle: z.string().optional()
  }),
  async ({ slug, ...data } = {}, user) => {
    const profile = await prisma.profile.findUnique({ where: { slug } })
    if (profile?.userId !== user?.id && user?.role !== 'admin') {
      throw new Error('You are not allowed to update this profile')
    }

    return prisma.profile.update({
      where: { slug },
      data: {
        ...data,
        slug: data.name ? slugify(data.name) : undefined
      }
    })
  }
)

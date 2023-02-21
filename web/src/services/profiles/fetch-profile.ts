import prisma from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export const fetchProfile = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) return null
    const raw = await prisma.profile.findUnique({
      where: { slug },
      include: profileIncludes
    })

    return raw && new Profile(raw)
  }
)

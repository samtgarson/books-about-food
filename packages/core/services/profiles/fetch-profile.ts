import { Profile } from 'core/models/profile'
import { Service } from 'core/services/base'
import prisma, { cacheStrategy } from 'database'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export const fetchProfile = new Service(
  z
    .object({ slug: z.string(), userId: z.never().optional() })
    .or(z.object({ userId: z.string(), slug: z.never().optional() })),
  async ({ slug, userId } = {}) => {
    if (!slug && !userId) return null
    const raw = await prisma.profile.findUnique({
      where: { slug, userId },
      include: profileIncludes,
      cacheStrategy
    })

    return raw && new Profile(raw)
  }
)

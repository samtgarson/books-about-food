import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { profileIncludes } from '../utils'

const base = z.object({ onlyPublished: z.boolean().optional() })
export const fetchProfile = new Service(
  base
    .extend({
      slug: z.string(),
      userId: z.never().optional()
    })
    .or(
      base.extend({
        userId: z.string(),
        slug: z.never().optional()
      })
    ),
  async ({ slug, userId, onlyPublished } = {}) => {
    if (!slug && !userId) return null

    const where: Prisma.ProfileWhereUniqueInput = { slug, userId }
    if (onlyPublished)
      where.OR = [
        { authoredBooks: { some: { status: 'published' } } },
        { contributions: { some: { book: { status: 'published' } } } }
      ]

    const raw = await prisma.profile.findUnique({
      where,
      include: profileIncludes
    })

    return raw && new Profile(raw)
  }
)

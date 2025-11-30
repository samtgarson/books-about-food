import { Profile } from '@books-about-food/core/models/profile'
import { Service } from '@books-about-food/core/services/base'
import prisma, { Prisma } from '@books-about-food/database'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export const fetchProfile = new Service(
  z.object({ onlyPublished: z.boolean().optional(), slug: z.string() }),
  async ({ slug, onlyPublished }) => {
    const where: Prisma.ProfileWhereUniqueInput = { slug }

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

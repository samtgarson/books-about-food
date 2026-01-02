import prisma, { Prisma } from '@books-about-food/database'
import { Profile } from 'src/core/models/profile'
import { Service } from 'src/core/services/base'
import { z } from 'zod'
import { profileIncludes } from '../utils'

export const fetchProfile = new Service(
  z.object({ onlyPublished: z.boolean().optional(), slug: z.string() }),
  async ({ slug, onlyPublished }, _ctx) => {
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

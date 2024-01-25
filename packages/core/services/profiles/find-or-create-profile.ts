import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import z from 'zod'
import { Profile } from '../../models/profile'
import { AuthedService } from '../base'
import { profileIncludes } from '../utils'

export const findOrCreateProfile = new AuthedService(
  z.object({ name: z.string() }),
  async function ({ name } = {}) {
    const found = await prisma.profile.findMany({
      where: { name },
      include: profileIncludes
    })
    if (found.length > 1) return undefined
    if (found.length) return new Profile(found[0])

    const created = await prisma.profile.create({
      data: { name, slug: slugify(name) },
      include: profileIncludes
    })
    return new Profile(created)
  }
)

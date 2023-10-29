'use server'

import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { profileIncludes } from 'src/services/utils'

export async function createProfile(name: string) {
  const profile = await prisma.profile.create({
    data: { name, slug: slugify(name) },
    include: profileIncludes
  })
  return profile
}

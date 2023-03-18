import { Prisma } from 'database'

export const profileIncludes = {
  user: { select: { image: true } },
  avatar: true
} satisfies Prisma.ProfileArgs['include']

export const bookIncludes = {
  coverImage: true,
  contributions: {
    include: { profile: { include: profileIncludes }, job: true },
    where: { job: { name: 'Author' } }
  }
} satisfies Prisma.BookArgs['include']

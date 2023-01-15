import { Prisma } from 'database'

export const profileIncludes = {
  include: { user: { select: { image: true } } }
} satisfies Prisma.ProfileArgs

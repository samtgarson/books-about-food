import { Prisma } from 'database'

export const profileIncludes = {
  include: { user: { select: { image: true } }, jobs: true, avatar: true }
} satisfies Prisma.ProfileArgs

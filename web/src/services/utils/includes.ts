import { Prisma } from 'database'

export const profileIncludes = {
  user: { select: { image: true } },
  avatar: true
} satisfies Prisma.ProfileArgs['include']

export const bookIncludes = {
  coverImage: true,
  previewImages: { orderBy: { createdAt: 'asc' } },
  publisher: { include: { logo: true } },
  tags: true,
  links: { orderBy: { site: 'asc' } },
  authors: { include: profileIncludes },
  contributions: {
    distinct: ['profileId'],
    include: {
      profile: { include: profileIncludes },
      job: true
    }
  }
} satisfies Prisma.BookArgs['include']

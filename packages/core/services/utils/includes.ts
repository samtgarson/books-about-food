import { Prisma } from '@books-about-food/database'

export const profileIncludes = {
  avatar: true,
  _count: { select: { authoredBooks: true } }
} satisfies Prisma.ProfileDefaultArgs['include']

export const publisherIncludes = {
  logo: true,
  imprints: { select: { name: true, slug: true } },
  house: { select: { name: true, slug: true } }
}

export const bookIncludes = {
  coverImage: true,
  authors: { include: profileIncludes },
  contributions: {
    where: { NOT: { job: { name: { startsWith: 'Author' } } } },
    include: {
      profile: { include: profileIncludes },
      job: true
    }
  }
} satisfies Prisma.BookDefaultArgs['include']

export const fullBookIncludes = {
  ...bookIncludes,
  previewImages: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
  publisher: { include: publisherIncludes },
  tags: { select: { slug: true, name: true } },
  links: { orderBy: { site: 'asc' } }
} satisfies Prisma.BookDefaultArgs['include']

export const teamIncludes = {
  memberships: { include: { user: true } },
  invitations: { where: { acceptedAt: null }, include: { invitedBy: true } },
  publishers: { include: publisherIncludes }
} satisfies Prisma.TeamDefaultArgs['include']

export const promoIncludes = {
  promoItems: {
    include: { book: { include: bookIncludes } },
    orderBy: { order: 'asc' }
  }
} satisfies Prisma.PromoDefaultArgs['include']

import { Prisma } from '@books-about-food/database'

export const locationIncludes = {
  _count: { select: { profiles: true } }
} satisfies Prisma.LocationDefaultArgs['include']

export const profileIncludes = {
  avatar: true,
  _count: { select: { authoredBooks: true } },
  locations: { include: locationIncludes }
} satisfies Prisma.ProfileDefaultArgs['include']

export const publisherIncludes = {
  logo: true,
  imprints: { select: { name: true, slug: true } },
  house: { select: { name: true, slug: true } },
  _count: { select: { memberships: true } }
} satisfies Prisma.PublisherDefaultArgs['include']

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
  tags: {
    select: { slug: true, name: true },
    where: { group: { adminOnly: false } }
  },
  links: { orderBy: { site: 'asc' } }
} satisfies Prisma.BookDefaultArgs['include']

export const membershipIncludes = {
  user: true
} satisfies Prisma.MembershipDefaultArgs['include']

export const invitationIncludes = {
  invitedBy: true
} satisfies Prisma.PublisherInvitationDefaultArgs['include']

export const collectionIncludes = {
  collectionItems: {
    include: { book: { include: bookIncludes } }
  }
} satisfies Prisma.CollectionDefaultArgs['include']

export const tagGroupIncludes = {
  tags: { orderBy: { name: 'asc' as const } }
} satisfies Prisma.TagGroupDefaultArgs['include']

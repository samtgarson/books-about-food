import {
  bookIncludes,
  profileIncludes
} from '@books-about-food/core/services/utils'
import type { Prisma } from '@books-about-food/database'

type ProfileIncludes = typeof profileIncludes

export type BookAttrs = Prisma.BookGetPayload<{
  include: typeof bookIncludes
}>

export type FullBookAttrs = Prisma.BookGetPayload<{
  include: typeof bookIncludes & {
    previewImages: true
    publisher: { include: { logo: true } }
    tags: true
    links: true
  }
}>

export type PublisherAttrs = Prisma.PublisherGetPayload<{
  include: { logo: true }
}>

export type ProfileAttrs = Prisma.ProfileGetPayload<{
  include: ProfileIncludes
}>

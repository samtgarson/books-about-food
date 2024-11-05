import {
  bookIncludes,
  fullBookIncludes,
  profileIncludes,
  promoIncludes,
  publisherIncludes,
  teamIncludes
} from '@books-about-food/core/services/utils'
import type { BookVote, Prisma } from '@books-about-food/database'

type ProfileIncludes = typeof profileIncludes

export type BookAttrs = Prisma.BookGetPayload<{
  include: typeof bookIncludes
}>

export type FullBookAttrs = Prisma.BookGetPayload<{
  include: typeof fullBookIncludes
}>

export type PublisherAttrs = Prisma.PublisherGetPayload<{
  include: typeof publisherIncludes
}>

export type ProfileAttrs = Prisma.ProfileGetPayload<{
  include: ProfileIncludes
}>

export type TeamAttrs = Prisma.TeamGetPayload<{
  include: typeof teamIncludes
}>

export type PromoAttrs = Prisma.PromoGetPayload<{
  include: typeof promoIncludes
}>

export type PostAttrs = Prisma.PostGetPayload<null>

export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export type { BookVote }

import {
  bookIncludes,
  collectionIncludes,
  fullBookIncludes,
  invitationIncludes,
  locationIncludes,
  membershipIncludes,
  profileIncludes,
  publisherIncludes
} from '@books-about-food/core/services/utils'
import type { BookVote, Prisma } from '@books-about-food/database'

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
  include: typeof profileIncludes
}>

export type MembershipAttrs = Prisma.MembershipGetPayload<{
  include: typeof membershipIncludes
}>

export type InvitationAttrs = Prisma.PublisherInvitationGetPayload<{
  include: typeof invitationIncludes
}>

export type CollectionAttrs = Prisma.CollectionGetPayload<{
  include: typeof collectionIncludes
}>

export type PostAttrs = Prisma.PostGetPayload<null>

export type LocationAttrs = Prisma.LocationGetPayload<{
  include: typeof locationIncludes
}>

export type BookResult = {
  id: string
  title: string
  authors: string[]
  image?: string
}

export type { BookVote }

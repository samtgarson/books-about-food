import type { Prisma } from 'database'

type ProfileIncludes = {
  jobs: true
  avatar: true
}

export type BookAttrs = Prisma.BookGetPayload<{
  include: {
    coverImage: true
    contributions: {
      include: { profile: { include: ProfileIncludes }; job: true }
    }
  }
}>

export type FullBookAttrs = Prisma.BookGetPayload<{
  include: {
    coverImage: true
    previewImages: true
    publisher: { include: { logo: true } }
    tags: true
    links: true
    contributions: {
      include: { profile: { include: ProfileIncludes }; job: true }
    }
  }
}>

export type PublisherAttrs = Prisma.PublisherGetPayload<{
  include: { logo: true }
}>

export type ProfileAttrs = Prisma.ProfileGetPayload<{
  include: ProfileIncludes
}>

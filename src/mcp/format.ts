import Color from 'color'
import type { Book } from 'src/core/models/book'
import type { Collection } from 'src/core/models/collection'
import type { FullBook } from 'src/core/models/full-book'
import type { Image } from 'src/core/models/image'
import type { Profile } from 'src/core/models/profile'
import type { Publisher } from 'src/core/models/publisher'
import { namedColorFor } from 'src/core/services/books/fetch-books/color-matching'
import { appUrl } from 'src/utils/app-url'
import type { Hsl } from 'src/utils/types'

/**
 * Plain JSON shapes returned by the MCP tools. These only include public
 * information, the same as is shown on the website.
 */

function image(img: Image | undefined) {
  if (!img) return undefined
  return { url: img.src, width: img.width, height: img.height }
}

export function colour(hsl: Hsl) {
  return {
    hex: Color.hsl(hsl.h, hsl.s, hsl.l).hex(),
    hsl,
    name: namedColorFor(hsl) ?? null
  }
}

export function bookSummary(book: Book) {
  return {
    title: book.title,
    subtitle: book.subtitle,
    slug: book.slug,
    url: appUrl(book.href),
    authors: book.authors.map((author) => author.name),
    releaseDate: book.isoReleaseDate,
    cover: image(book.cover),
    backgroundColour: book.backgroundColor
      ? new Color(book.backgroundColor).hex()
      : undefined,
    palette: book.colors.map(colour)
  }
}

export function bookDetail(book: FullBook) {
  return {
    ...bookSummary(book),
    blurb: book.blurb,
    designCommentary: book.designCommentary,
    pages: book.pages,
    publisher: book.publisher
      ? { name: book.publisher.name, slug: book.publisher.slug }
      : undefined,
    authors: book.authors.map(personRef),
    contributors: book.contributions.map((contribution) => ({
      ...personRef(contribution.profile),
      role: contribution.jobName
    })),
    tags: book.tags,
    previewImages: book.previewImages.map(image),
    links: book.links.map((link) => ({ site: link.site, url: link.url }))
  }
}

export function personRef(profile: Profile) {
  return { name: profile.name, slug: profile.slug }
}

export function profileSummary(profile: Profile) {
  return {
    name: profile.name,
    slug: profile.slug,
    url: appUrl(profile.href),
    jobTitle: profile.jobTitle,
    location: profile.location
  }
}

export function profileDetail(profile: Profile) {
  return {
    ...profileSummary(profile),
    bio: profile.description,
    website: profile.website,
    instagram: profile.instagram,
    avatar: image(profile.avatar)
  }
}

export function publisherDetail(publisher: Publisher) {
  return {
    name: publisher.name,
    slug: publisher.slug,
    url: appUrl(publisher.href),
    description: publisher.description,
    website: publisher.website,
    instagram: publisher.instagram,
    logo: image(publisher.logo),
    house: publisher.house,
    imprints: publisher.imprints
  }
}

export function collectionSummary(collection: Collection) {
  return {
    title: collection.title,
    slug: collection.slug,
    url: appUrl(collection.href),
    description: collection.description,
    bookCount: collection.books.length
  }
}

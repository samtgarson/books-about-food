import { BookStatus } from 'database'
import { Image } from './image'
import { Profile } from './profile'
import { BookAttrs } from './types'
import format from 'date-fns/format'
import isFuture from 'date-fns/isFuture'

export class Book {
  id: string
  title: string
  subtitle?: string
  slug: string
  cover?: Image
  releaseDate?: Date
  pages?: number
  contributions: BookAttrs['contributions']
  status: BookStatus

  constructor({
    id,
    title,
    subtitle,
    slug,
    coverImage,
    releaseDate,
    pages,
    contributions,
    status
  }: BookAttrs) {
    this.id = id
    this.title = title
    this.subtitle = subtitle ?? undefined
    this.slug = slug
    this.cover = coverImage
      ? new Image(coverImage, `Cover for ${title}`)
      : undefined
    this.releaseDate = releaseDate ?? undefined
    this.pages = pages ?? undefined
    this.contributions = contributions ?? []
    this.status = status
  }

  get href() {
    if (this.status !== 'published') return `/edit/${this.slug}`
    return `/cookbooks/${this.slug}`
  }

  get authors() {
    return this.contributions
      .filter((contribution) => contribution.job?.name === 'Author')
      .map((contribution) => new Profile(contribution.profile))
  }

  get team(): Profile[] {
    return this.contributions
      .filter((contribution) => contribution.job?.name !== 'Author')
      .map((contribution) => new Profile(contribution.profile))
  }

  get authorNames() {
    return this.authors.map((author) => author.name).join(' • ')
  }

  get formattedReleaseDate() {
    return this.releaseDate && format(this.releaseDate, 'd MMMM yyyy')
  }

  get shortReleaseDate() {
    return this.releaseDate && format(this.releaseDate, 'MMM yyyy')
  }

  get publishedInFuture() {
    return this.releaseDate && isFuture(this.releaseDate)
  }
}

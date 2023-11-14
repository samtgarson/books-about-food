import { BookStatus } from '@books-about-food/database'
import format from 'date-fns/format'
import isFuture from 'date-fns/isFuture'
import { BaseModel } from '.'
import { Contribution } from './contribution'
import { Image } from './image'
import { Profile } from './profile'
import { BookAttrs } from './types'

export class Book extends BaseModel {
  _type = 'book' as const
  id: string
  title: string
  subtitle?: string
  slug: string
  cover?: Image
  releaseDate?: Date
  pages?: number
  contributions: Contribution[]
  authors: Profile[]
  status: BookStatus
  submitterId?: string
  backgroundColor?: string

  constructor(attrs: BookAttrs) {
    super()
    this.id = attrs.id
    this.title = attrs.title
    this.subtitle = attrs.subtitle ?? undefined
    this.slug = attrs.slug
    this.cover = attrs.coverImage
      ? new Image(attrs.coverImage, `Cover for ${attrs.title}`)
      : undefined
    this.releaseDate = attrs.releaseDate ?? undefined
    this.pages = attrs.pages ?? undefined
    this.contributions = (attrs.contributions ?? []).map(
      (contribution) => new Contribution(contribution)
    )
    this.status = attrs.status
    this.submitterId = attrs.submitterId ?? undefined
    this.authors = attrs.authors?.map((author) => new Profile(author)) ?? []
    this.backgroundColor = attrs.backgroundColor
      ? `rgb(${attrs.backgroundColor.join(',')})`
      : undefined
  }

  get name() {
    return this.title
  }

  get ariaLabel() {
    return `${this.title} by ${this.authorNames} ${
      this.releaseDate ? `(${this.formattedReleaseDate})` : ''
    }`
  }

  get href() {
    if (this.status !== 'published') return `/edit/${this.slug}`
    return `/cookbooks/${this.slug}`
  }

  get team(): Profile[] {
    return this.contributions.map((contribution) => contribution.profile)
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

import { Hsl, isHsl, toColorString } from '@books-about-food/shared/utils/types'
import Color from 'color'
import { format, isFuture } from 'date-fns'
import type {
  Book as PayloadBook,
  Image as PayloadImage
} from 'src/payload/payload-types'
import { BaseModel } from '.'
import { Contribution } from './contribution'
import { Image } from './image'
import { Profile } from './profile'
import { BookStatus } from './types'
import {
  extractId,
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

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
  colors: Hsl[]
  blurb?: string
  designCommentary?: string

  constructor(attrs: PayloadBook) {
    super()

    // Validate relationships are populated
    const coverImage = optionalPopulated<PayloadImage>(
      attrs.coverImage,
      'Book.coverImage'
    )
    const authors = requirePopulatedArray(attrs.authors, 'Book.authors')

    // Validate contributions array
    const hasUnpopulatedContributions = attrs.contributions?.some(
      (c) => typeof c.profile === 'string' || typeof c.job === 'string'
    )
    if (hasUnpopulatedContributions) {
      throw new Error(
        'Book.contributions (profile/job) must be populated. Ensure sufficient depth when querying.'
      )
    }

    this.id = attrs.id
    this.title = attrs.title
    this.subtitle = attrs.subtitle ?? undefined
    this.slug = attrs.slug
    this.cover = coverImage
      ? new Image(coverImage, `Cover for ${attrs.title}`, true)
      : undefined
    this.releaseDate = attrs.releaseDate
      ? new Date(attrs.releaseDate)
      : undefined
    this.pages = attrs.pages ?? undefined
    this.contributions = (attrs.contributions ?? []).map(
      (contribution) => new Contribution(contribution)
    )
    this.status = (attrs.status ?? 'draft') as BookStatus
    this.submitterId = extractId(attrs.submitter)
    this.authors = authors.map((author) => new Profile(author))
    this.backgroundColor = isHsl(attrs.backgroundColor)
      ? toColorString(attrs.backgroundColor)
      : undefined
    this.colors = (attrs.palette || []).map((p) => p.color).filter(isHsl)
    this.blurb = attrs.blurb ?? undefined
    this.designCommentary = attrs.designCommentary ?? undefined
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
    if (!this.authors.length) return
    return this.authors.map((author) => author.name).join(' • ')
  }

  get formattedReleaseDate() {
    return this.releaseDate && format(this.releaseDate, 'd MMMM yyyy')
  }

  get shortReleaseDate() {
    return this.releaseDate && format(this.releaseDate, 'MMM yyyy')
  }

  get isoReleaseDate() {
    return this.releaseDate && format(this.releaseDate, 'yyyy-MM-dd')
  }

  get publishedInFuture() {
    return this.releaseDate && isFuture(this.releaseDate)
  }

  get foregroundColor() {
    if (!this.backgroundColor) return
    return new Color(this.backgroundColor).isDark() ? '#fff' : '#000'
  }
}

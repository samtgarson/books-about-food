import { BookStatus } from '@books-about-food/database'
import { Hsl, isHsl, toColorString } from '@books-about-food/shared/utils/types'
import Color from 'color'
import { format, isFuture } from 'date-fns'
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
  colors: Hsl[]
  blurb?: string
  designCommentary?: string

  constructor(attrs: BookAttrs) {
    super()
    this.id = attrs.id
    this.title = attrs.title
    this.subtitle = attrs.subtitle ?? undefined
    this.slug = attrs.slug
    this.cover = attrs.coverImage
      ? new Image(attrs.coverImage, `Cover for ${attrs.title}`, true)
      : undefined
    this.releaseDate = attrs.releaseDate ?? undefined
    this.pages = attrs.pages ?? undefined
    this.contributions = (attrs.contributions ?? []).map(
      (contribution) => new Contribution(contribution)
    )
    this.status = attrs.status
    this.submitterId = attrs.submitterId ?? undefined
    this.authors = attrs.authors?.map((author) => new Profile(author)) ?? []
    this.backgroundColor = isHsl(attrs.backgroundColor)
      ? toColorString(attrs.backgroundColor)
      : undefined
    this.colors = Array.isArray(attrs.palette)
      ? attrs.palette.filter(isHsl)
      : []
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

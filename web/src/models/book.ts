import { Image } from './image'
import { Profile } from './profile'
import { BookAttrs } from './types'

export class Book {
  id: string
  title: string
  subtitle?: string
  slug: string
  cover?: Image
  releaseDate: Date
  pages: number
  authors: Profile[]

  constructor({
    id,
    title,
    subtitle,
    slug,
    coverImage,
    releaseDate,
    pages,
    contributions
  }: BookAttrs) {
    this.id = id
    this.title = title
    this.subtitle = subtitle ?? undefined
    this.slug = slug
    this.cover = coverImage
      ? new Image(coverImage, `Cover for ${title}`)
      : undefined
    this.releaseDate = releaseDate
    this.pages = pages
    this.authors = contributions
      .filter((contribution) => contribution.job?.name === 'Author')
      .map((contribution) => new Profile(contribution.profile))
  }

  get authorNames() {
    return this.authors.map((author) => author.name).join(' • ')
  }
}

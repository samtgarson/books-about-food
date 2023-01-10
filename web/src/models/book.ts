import { Image } from './image'
import { Profile } from './profile'
import { Publisher } from './publisher'
import { BookAttrs, FullBookAttrs } from './types'

export class Book {
  id: string
  title: string
  subtitle?: string
  slug: string
  cover?: Image
  releaseDate: Date
  pages: number

  constructor({
    id,
    title,
    subtitle,
    slug,
    coverImage,
    releaseDate,
    pages
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
  }
}

export class FullBook extends Book {
  previewImages: Image[]
  tags: string[]
  publisher: Publisher
  contributions: {
    jobs: string[]
    profile: Profile
  }[]

  constructor(attrs: FullBookAttrs) {
    super(attrs)
    this.previewImages = attrs.previewImages.map(
      (image) => new Image(image, `Preview for ${attrs.title}`)
    )
    this.tags = attrs.tags.map((tag) => tag.name)
    this.publisher = new Publisher(attrs.publisher)
    this.contributions = attrs.contributions.map((contribution) => ({
      jobs: contribution.jobs.map((job) => job.name),
      profile: new Profile(contribution.profile)
    }))
  }
}

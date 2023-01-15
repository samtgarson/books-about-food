import { Book } from './book'
import { Image } from './image'
import { Profile } from './profile'
import { Publisher } from './publisher'
import { FullBookAttrs } from './types'

export class FullBook extends Book {
  previewImages: Image[]
  tags: string[]
  publisher: Publisher
  contributions: {
    job?: string
    profile: Profile
  }[]

  constructor(attrs: FullBookAttrs) {
    super(attrs)
    this.previewImages = attrs.previewImages.map(
      (image) => new Image(image, `Preview for ${attrs.title}`)
    )
    this.tags = attrs.tags.map((tag) => tag.name)
    this.publisher = new Publisher(attrs.publisher)
    this.contributions = attrs.contributions
      .filter((contribution) => contribution.job?.name !== 'Author')
      .map((contribution) => ({
        job: contribution.job?.name,
        profile: new Profile(contribution.profile)
      }))
  }
}

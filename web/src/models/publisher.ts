import { Image } from './image'
import { PublisherAttrs } from './types'

export class Publisher {
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  logo?: Image

  constructor(attrs: PublisherAttrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.slug = attrs.slug
    this.website = attrs.website ?? undefined
    this.instagram = attrs.instagram ?? undefined
    this.logo = attrs.logo
      ? new Image(attrs.logo, `Logo for ${attrs.name}`)
      : undefined
  }
}

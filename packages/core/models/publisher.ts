import { Image } from './image'
import { PublisherAttrs } from './types'

type PublisherRef = { name: string; slug: string }

export class Publisher {
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  logo?: Image
  imprints: PublisherRef[]
  house?: PublisherRef

  constructor(attrs: PublisherAttrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.slug = attrs.slug
    this.website = attrs.website ?? undefined
    this.instagram = attrs.instagram ?? undefined
    this.logo = attrs.logo
      ? new Image(attrs.logo, `Logo for ${attrs.name}`)
      : undefined
    this.imprints = attrs.imprints
    this.house = attrs.house ?? undefined
  }
}

import { Image } from './image'
import { PublisherAttrs } from './types'

export class Publisher {
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  logo?: Image

  constructor({ id, name, slug, website, instagram, logo }: PublisherAttrs) {
    this.id = id
    this.name = name
    this.slug = slug
    this.website = website ?? undefined
    this.instagram = instagram ?? undefined
    this.logo = logo ? new Image(logo, `Logo for ${name}`) : undefined
  }

  get url() {
    return `/publishers/${this.slug}`
  }
}

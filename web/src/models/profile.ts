import { ProfileAttrs } from './types'

export class Profile {
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  image?: string

  constructor({ id, name, slug, website, instagram, user }: ProfileAttrs) {
    this.id = id
    this.name = name
    this.slug = slug
    this.website = website ?? undefined
    this.instagram = instagram ?? undefined
    this.image = user?.image ?? undefined
  }
}

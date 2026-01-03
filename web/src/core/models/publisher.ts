import type { Publisher as PayloadPublisher } from 'src/payload/payload-types'
import { BaseModel } from '.'
import { Image } from './image'
import {
  extractIds,
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

type PublisherRef = { name: string; slug: string }

export class Publisher extends BaseModel {
  _type = 'publisher' as const
  id: string
  name: string
  slug: string
  website?: string
  instagram?: string
  logo?: Image
  imprints: PublisherRef[]
  house?: PublisherRef
  hiddenBooks: string[] = []
  description?: string
  claimed: boolean

  constructor(attrs: PayloadPublisher) {
    super()

    // Validate relationships are populated
    const logo = optionalPopulated(attrs.logo, 'Publisher.logo')
    const house = optionalPopulated(attrs.house, 'Publisher.house')

    // Validate imprints join field
    const imprintDocs =
      typeof attrs.imprints === 'object' ? attrs.imprints?.docs : undefined
    const imprints = requirePopulatedArray(imprintDocs, 'Publisher.imprints')

    this.id = attrs.id
    this.name = attrs.name
    this.slug = attrs.slug
    this.website = attrs.website ?? undefined
    this.instagram = attrs.instagram ?? undefined
    this.logo = logo
      ? new Image(logo, `Logo for ${attrs.name}`, true)
      : undefined
    this.imprints = imprints
    this.house = house
    this.hiddenBooks = extractIds(attrs.hiddenBooks)
    this.description = attrs.description ?? undefined
    this.claimed = attrs.claimed ?? false
  }

  get href() {
    return `/publishers/${this.slug}`
  }
}

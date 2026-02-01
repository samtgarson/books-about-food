import type { SearchResultType } from 'src/payload/collections/search-results'
import type {
  Image as PayloadImage,
  SearchResult as PayloadSearchResult
} from 'src/payload/payload-types'
import { Image } from './image'
import { Colourful } from './mixins/colourful'
import { optionalPopulated } from './utils/payload-validation'

export type { SearchResultType }

export class SearchResult extends Colourful(
  class {
    id: string
    name: string
    type: SearchResultType
    image?: Image
    description?: string
    slug: string
    updatedAt: Date

    constructor(attrs: PayloadSearchResult) {
      const image = optionalPopulated<PayloadImage>(
        attrs.image,
        'SearchResult.image'
      )

      this.id = attrs.id
      this.name = attrs.name
      this.type = attrs.type
      this.description = attrs.description?.replace(/<[^>]+>/g, '') ?? undefined
      this.slug = attrs.slug
      this.updatedAt = new Date(attrs.updatedAt)
      this.image = image
        ? new Image(image, `Preview image for ${this.name}`)
        : undefined
    }

    get domId() {
      return `quick-search-result-${this.id}`
    }

    get isProfile() {
      return this.type === 'profile'
    }

    get initials() {
      const names = this.name.split(' ')
      return names.reduce((acc, name) => acc + name[0], '')
    }

    get href() {
      switch (this.type) {
        case 'book':
          return `/cookbooks/${this.slug}`
        case 'profile':
          return `/people/${this.slug}`
        case 'publisher':
          return `/publishers/${this.slug}`
        case 'bookTag':
          return `/cookbooks?tags=${this.slug}`
        case 'collection':
          return `/collections/${this.slug}`
      }
    }
  }
) {}

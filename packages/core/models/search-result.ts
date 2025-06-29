import {
  SearchResult as PrismaSearchResult,
  SearchResultType
} from '@books-about-food/database'
import { z } from 'zod'
import { Image } from './image'
import { Colourful } from './mixins/colourful'

const imageSchema = z.object({
  id: z.string(),
  path: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().nullish().default(null),
  order: z.number().default(0),
  placeholderUrl: z
    .string()
    .nullish()
    .transform((val) => val ?? null)
})

export class SearchResult extends Colourful(
  class {
    id: string
    name: string
    type: SearchResultType
    image?: Image
    description?: string
    slug: string
    updatedAt: Date

    constructor(attrs: PrismaSearchResult) {
      this.id = attrs.id
      this.name = attrs.name
      this.type = attrs.type
      this.description = attrs.description?.replace(/<[^>]+>/g, '') ?? undefined
      this.slug = attrs.slug
      this.updatedAt = attrs.updatedAt

      if (attrs.image) {
        const imageAttrs = imageSchema.parse(attrs.image)
        this.image = new Image(imageAttrs, `Preview image for ${this.name}`)
      }
    }

    get domId() {
      return `quick-search-result-${this.id}`
    }

    get isProfile() {
      return ['contributor', 'author'].includes(this.type)
    }

    get initials() {
      const names = this.name.split(' ')
      return names.reduce((acc, name) => acc + name[0], '')
    }

    get href() {
      switch (this.type) {
        case 'book':
          return `/cookbooks/${this.slug}`
        case 'contributor':
          return `/people/${this.slug}`
        case 'author':
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

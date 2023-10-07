import { z } from "zod"
import { Image } from "./image"
import { SearchResult as PrismaSearchResult } from "database"
import { Colourful } from "./mixins/colourful"

const imageSchema = z.object({
  id: z.string(),
  path: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().nullable(),
  placeholderUrl: z.string().nullish().transform((val) => val ?? null)
})

export class SearchResult extends Colourful(class {
  id: string
  name: string
  type: string
  image?: Image
  description?: string

  constructor(attrs: PrismaSearchResult) {
    this.id = attrs.id
    this.name = attrs.name
    this.type = attrs.type
    this.description = attrs.description ?? undefined

    if (attrs.image) {
      const imageAttrs = imageSchema.parse(attrs.image)
      this.image = new Image(imageAttrs, `Preview image for ${this.name}`)
    }
  }

  get isProfile() {
    return ['contributor', 'author'].includes(this.type)
  }

  get initials() {
    const names = this.name.split(' ')
    return names.reduce((acc, name) => acc + name[0], '')
  }
}) { }

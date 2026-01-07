import type { User as PayloadUser } from 'src/payload/payload-types'
import { Image } from './image'
import { Colourful } from './mixins/colourful'

export class User extends Colourful(
  class {
    id: string
    email: string
    name?: string
    image?: Image

    constructor(attrs: PayloadUser) {
      this.id = attrs.id
      this.email = attrs.email
      this.name = attrs.name ?? undefined
      this.image = attrs.image
        ? new Image(
            {
              id: attrs.id,
              url: attrs.image,
              width: 32,
              height: 32,
              placeholderUrl: null
            },
            `Avatar for ${attrs.name}`
          )
        : undefined
    }

    get displayName() {
      return this.name ?? this.email
    }

    is(other: { id: string }) {
      return this.id === other.id
    }
  }
) {}

import { User as DbUser } from '@books-about-food/database'
import { Image } from './image'
import { Colourful } from './mixins/colourful'

export class User extends Colourful(
  class {
    id: string
    email: string
    name?: string
    image?: Image

    constructor(attrs: DbUser) {
      this.id = attrs.id
      this.email = attrs.email
      this.name = attrs.name ?? undefined
      this.image = attrs.image
        ? new Image(
            {
              id: attrs.id,
              path: attrs.image,
              width: 32,
              height: 32,
              caption: null,
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

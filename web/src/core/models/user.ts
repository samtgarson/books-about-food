import type { User as PayloadUser } from 'src/payload/payload-types'
import { Colourful } from './mixins/colourful'

export class User extends Colourful(
  class {
    id: string
    email: string
    name?: string

    constructor(attrs: PayloadUser) {
      this.id = attrs.id
      this.email = attrs.email
      this.name = attrs.name ?? undefined
    }

    get displayName() {
      return this.name ?? this.email
    }

    is(other: { id: string }) {
      return this.id === other.id
    }
  }
) {}

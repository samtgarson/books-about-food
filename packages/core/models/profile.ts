import { normalizeUrl } from '@books-about-food/core/utils/url'
import { BaseModel } from '.'
import { Image } from './image'
import { Colourful } from './mixins/colourful'
import { ProfileAttrs } from './types'

export class Profile extends Colourful(
  class extends BaseModel {
    _type = 'profile' as const
    id: string
    name: string
    description?: string
    slug: string
    website?: string
    instagram?: string
    avatar?: Image
    jobTitle?: string
    location?: string
    mostRecentlyPublishedOn?: Date
    userId?: string
    hiddenCollaborators: string[]
    role: 'author' | 'contributor'

    constructor(attrs: ProfileAttrs) {
      super()
      this.id = attrs.id
      this.name = attrs.name
      this.description = attrs.description ?? undefined
      this.slug = attrs.slug
      this.website = normalizeUrl(attrs.website ?? undefined)
      this.instagram = attrs.instagram ?? undefined
      this.avatar = attrs.avatar
        ? new Image(attrs.avatar, `Avatar for ${attrs.name}`, true)
        : undefined
      this.jobTitle = attrs.jobTitle ?? undefined
      this.mostRecentlyPublishedOn = attrs.mostRecentlyPublishedOn ?? undefined
      this.userId = attrs.userId ?? undefined
      this.hiddenCollaborators = attrs.hiddenCollaborators
      this.location = attrs.location ?? undefined
      this.role = attrs._count.authoredBooks > 0 ? 'author' : 'contributor'
    }

    get initials() {
      const names = this.name.split(' ')
      return names.reduce((acc, name) => acc + name[0], '')
    }

    get href() {
      return `/${this.role}s/${this.slug}`
    }

    get claimed() {
      return !!this.userId
    }
  }
) {}

export class NullProfile extends Profile {
  constructor() {
    super({
      userId: '',
      id: '',
      name: '',
      slug: '',
      website: '',
      instagram: '',
      avatar: null,
      jobTitle: '',
      description: '',
      mostRecentlyPublishedOn: new Date(),
      location: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      hiddenCollaborators: [],
      _count: { authoredBooks: 0 }
    })
  }

  get backgroundColour() {
    return '#E7E5E2'
  }

  get foregroundColour() {
    return '#000' as const
  }

  get initials() {
    return ''
  }
}

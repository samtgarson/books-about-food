import Color from 'color'
import randomColor from 'randomcolor'
import { normalizeLink } from 'src/utils/url-helpers'
import { Image } from './image'
import { ProfileAttrs } from './types'
import { colors } from 'theme'
import { BaseModel } from '.'

export class Profile extends BaseModel {
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
    this.website = normalizeLink(attrs.website ?? undefined)
    this.instagram = attrs.instagram ?? undefined
    this.avatar = attrs.avatar
      ? new Image(attrs.avatar, `Avatar for ${attrs.name}`)
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

  get backgroundColour() {
    return randomColor({ seed: this.id, luminosity: 'bright' })
  }

  get foregroundColour() {
    return new Color(this.backgroundColour).isDark() ? '#fff' : '#000'
  }

  get href() {
    return `/${this.role}s/${this.id}`
  }
}

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
      user: null,
      _count: { authoredBooks: 0 }
    })
  }

  get backgroundColour() {
    return colors.sand
  }

  get foregroundColour() {
    return '#000' as const
  }

  get initials() {
    return ''
  }
}

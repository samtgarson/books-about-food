import Color from 'color'
import randomColor from 'randomcolor'
import { normalizeLink } from 'src/utils/url-helpers'
import { Image } from './image'
import { ProfileAttrs } from './types'
import { colors } from 'theme'

export class Profile {
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

  constructor({
    id,
    name,
    slug,
    website,
    instagram,
    jobTitle,
    location,
    avatar,
    description,
    mostRecentlyPublishedOn,
    userId,
    hiddenCollaborators
  }: ProfileAttrs) {
    this.id = id
    this.name = name
    this.description = description ?? undefined
    this.slug = slug
    this.website = normalizeLink(website ?? undefined)
    this.instagram = instagram ?? undefined
    this.avatar = avatar ? new Image(avatar, `Avatar for ${name}`) : undefined
    this.jobTitle = jobTitle ?? undefined
    this.mostRecentlyPublishedOn = mostRecentlyPublishedOn ?? undefined
    this.userId = userId ?? undefined
    this.hiddenCollaborators = hiddenCollaborators
    this.location = location ?? undefined
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
      hiddenCollaborators: []
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

import { normalizeUrl } from 'src/core/utils/url'
import type { Profile as PayloadProfile } from 'src/payload/payload-types'
import { BaseModel } from '.'
import { Image } from './image'
import { Location } from './location'
import { Colourful } from './mixins/colourful'
import {
  extractId,
  extractIds,
  optionalPopulated,
  requirePopulatedArray
} from './utils/payload-validation'

type ProfileAttrs = PayloadProfile & {
  hiddenFrequentCollaborators?: (string | PayloadProfile)[] | null
}

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
    locations: Location[]
    mostRecentlyPublishedOn?: Date
    userId?: string
    hiddenCollaborators: string[]

    constructor(attrs: ProfileAttrs) {
      super()

      // Validate relationships are populated
      const avatar = optionalPopulated(attrs.avatar, 'Profile.avatar')
      const locations = requirePopulatedArray(
        attrs.locations,
        'Profile.locations'
      )

      this.id = attrs.id
      this.name = attrs.name
      this.description = attrs.description ?? undefined
      this.slug = attrs.slug
      this.website = normalizeUrl(attrs.website ?? undefined)
      this.instagram = attrs.instagram ?? undefined
      this.avatar = avatar
        ? new Image(avatar, `Avatar for ${attrs.name}`, true)
        : undefined
      this.jobTitle = attrs.jobTitle ?? undefined
      this.mostRecentlyPublishedOn = attrs.mostRecentlyPublishedOn
        ? new Date(attrs.mostRecentlyPublishedOn)
        : undefined
      this.userId = extractId(attrs.user)
      this.hiddenCollaborators = extractIds(attrs.hiddenFrequentCollaborators)
      this.locations = locations.map((loc) => new Location(loc))
    }

    get location(): string | undefined {
      if (this.locations.length === 0) return undefined
      return this.locations.map((l) => l.displayText).join(' • ')
    }

    get initials() {
      const names = this.name.split(' ')
      return names.reduce((acc, name) => acc + name[0], '')
    }

    get href() {
      return `/people/${this.slug}`
    }

    get claimed() {
      return !!this.userId
    }
  }
) {}

export class NullProfile extends Profile {
  constructor() {
    super({
      id: '',
      name: '',
      slug: '',
      description: null,
      website: null,
      instagram: null,
      jobTitle: null,
      mostRecentlyPublishedOn: null,
      hiddenFrequentCollaborators: [],
      createdAt: '2000-01-01T00:00:00.000Z',
      updatedAt: '2000-01-01T00:00:00.000Z',
      avatar: undefined,
      locations: [],
      user: undefined,
      contributions: undefined
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

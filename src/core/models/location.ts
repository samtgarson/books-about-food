import type { Location as PayloadLocation } from 'src/payload/payload-types'
import { BaseModel } from '.'

export class Location extends BaseModel {
  _type = 'location' as const
  id: string
  slug: string
  placeId: string
  displayText: string
  country?: string
  region?: string
  latitude: number
  longitude: number
  profileCount: number

  constructor(attrs: PayloadLocation) {
    super()
    this.id = attrs.id
    this.slug = attrs.slug
    this.placeId = attrs.placeId
    this.displayText = attrs.displayText
    this.country = attrs.country ?? undefined
    this.region = attrs.region ?? undefined
    this.latitude = attrs.latitude
    this.longitude = attrs.longitude
    // profiles is a join field that may or may not be populated
    this.profileCount =
      typeof attrs.profiles === 'object' ? (attrs.profiles?.totalDocs ?? 0) : 0
  }

  get name() {
    return this.displayText
  }

  get href() {
    return `/locations/${this.slug}`
  }

  toString() {
    return this.displayText
  }
}

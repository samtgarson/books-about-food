import { BaseModel } from '.'
import { LocationAttrs } from './types'

export class Location extends BaseModel {
  _type = 'location' as const
  id: string
  placeId: string
  displayText: string
  country?: string
  region?: string
  latitude?: number
  longitude?: number

  constructor(attrs: LocationAttrs) {
    super()
    this.id = attrs.id
    this.placeId = attrs.placeId
    this.displayText = attrs.displayText
    this.country = attrs.country ?? undefined
    this.region = attrs.region ?? undefined
    this.latitude = attrs.latitude ?? undefined
    this.longitude = attrs.longitude ?? undefined
  }

  get name() {
    return this.displayText
  }

  get href() {
    return `/locations/${encodeURIComponent(this.placeId)}`
  }

  toString() {
    return this.displayText
  }
}

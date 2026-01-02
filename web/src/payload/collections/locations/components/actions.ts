'use server'

import { slugify } from '@books-about-food/shared/utils/slugify'
import { GooglePlacesGateway } from 'src/core/gateways/google-places'

const places = new GooglePlacesGateway()

export type LocationSearchResult = {
  placeId: string
  displayText: string
}

export type LocationDetails = {
  placeId: string
  displayText: string
  slug: string
  country: string | undefined
  region: string | undefined
  latitude: number
  longitude: number
}

export async function searchLocations(
  query: string,
  sessionToken: string
): Promise<LocationSearchResult[]> {
  if (query.length < 2) return []

  const results = await places.search(query, sessionToken)

  return results.map(({ description, place_id }) => ({
    displayText: description,
    placeId: place_id
  }))
}

export async function getLocationDetails(
  placeId: string,
  displayText: string
): Promise<LocationDetails | null> {
  const details = await places.getPlaceDetails(placeId)
  if (!details) return null

  return {
    placeId,
    displayText,
    slug: slugify(displayText),
    country: details.country,
    region: details.region,
    latitude: details.latitude,
    longitude: details.longitude
  }
}

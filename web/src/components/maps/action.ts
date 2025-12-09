'use server'

import { fetchLocations } from '@books-about-food/core/services/locations/fetch-locations'
import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export async function fetchProfilesByLocation(location: string) {
  const { data } = await call(fetchProfiles, {
    locations: [location],
    perPage: 'all'
  })
  return stringify(data?.profiles || [])
}

export async function fetchGeoJSON(): Promise<GeoJSON.GeoJSON | undefined> {
  const result = await call(fetchLocations, { hasProfiles: true })

  if (!result.success) {
    console.error(result.errors)
    return
  }

  const features = result.data.map((location) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [location.longitude, location.latitude]
    },
    properties: {
      id: location.id,
      displayText: location.displayText,
      country: location.country ?? null,
      region: location.region ?? null,
      profileCount: location.profileCount ?? 1
    }
  }))

  const geojson = {
    type: 'FeatureCollection' as const,
    features
  }

  return geojson
}

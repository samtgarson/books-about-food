import { fetchLocations } from '@books-about-food/core/services/locations/fetch-locations'
import { call } from 'src/utils/service'

export async function GET() {
  const result = await call(fetchLocations)

  if (!result.success) {
    return Response.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }

  const features = result.data
    .filter(
      (
        location
      ): location is typeof location & {
        latitude: number
        longitude: number
      } => location.latitude !== undefined && location.longitude !== undefined
    )
    .map((location) => ({
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

  return Response.json(geojson)
}

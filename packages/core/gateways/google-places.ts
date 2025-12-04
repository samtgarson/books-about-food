import { z } from 'zod'
import { BaseGoogleGateway } from './google/base-gateway'

export type GooglePlaceResult = z.infer<typeof autocompleteSchema>
export type PlaceDetails = z.output<typeof placeDetailsSchema>

const autocompleteSchema = z.object({
  description: z.string(),
  place_id: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string().optional()
  })
})

const addressComponentSchema = z.object({
  long_name: z.string(),
  short_name: z.string(),
  types: z.array(z.string())
})

const placeDetailsSchema = z
  .object({
    result: z.object({
      geometry: z.object({
        location: z.object({
          lat: z.number(),
          lng: z.number()
        })
      }),
      address_components: z.array(addressComponentSchema)
    })
  })
  .transform(({ result: { geometry, address_components } }) => {
    const country = address_components.find((c) => c.types.includes('country'))
    const region = address_components.find((c) =>
      c.types.includes('administrative_area_level_1')
    )

    return {
      latitude: geometry.location.lat,
      longitude: geometry.location.lng,
      country: country?.long_name,
      region: region?.long_name
    }
  })

export class GooglePlacesGateway extends BaseGoogleGateway {
  path = '/maps/api'
  subdomain = 'maps'

  async search(
    query: string,
    sessiontoken: string
  ): Promise<GooglePlaceResult[]> {
    const response = await this.request('/place/autocomplete/json', {
      input: query,
      types: '(regions)',
      sessiontoken
    })

    if (!response.ok) return []
    const result = await response.json()

    return z
      .object({ predictions: z.array(autocompleteSchema).default([]) })
      .parse(result).predictions
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    const response = await this.request('/place/details/json', {
      place_id: placeId,
      fields: 'geometry,address_components'
    })

    if (!response.ok) return null
    const result = await response.json()
    const parsed = placeDetailsSchema.safeParse(result)

    if (!parsed.success) return null

    return parsed.data
  }
}

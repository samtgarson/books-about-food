import { captureException } from '@sentry/nextjs'
import { z } from 'zod'
import { BaseGoogleGateway } from './google/base-gateway'

export type GooglePlaceResult = z.infer<typeof autocompleteSuggestionSchema>
export type PlaceDetails = z.output<typeof placeDetailsSchema>

const autocompleteSuggestionSchema = z
  .object({
    placePrediction: z.object({
      text: z.object({ text: z.string() }),
      placeId: z.string()
    })
  })
  .transform(({ placePrediction }) => {
    const fullText = placePrediction.text.text
    const parts = fullText.split(',').map((s) => s.trim())

    return {
      description: fullText,
      place_id: placePrediction.placeId,
      structured_formatting: {
        main_text: parts[0],
        secondary_text: parts.length > 1 ? parts.slice(1).join(', ') : undefined
      }
    }
  })

const autocompleteSchema = z
  .object({ suggestions: z.array(autocompleteSuggestionSchema) })
  .transform(({ suggestions }) => suggestions)

const placeDetailsSchema = z
  .object({
    location: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    addressComponents: z.array(
      z.object({
        longText: z.string(),
        shortText: z.string(),
        types: z.array(z.string())
      })
    )
  })
  .transform(({ location, addressComponents }) => {
    const country = addressComponents.find((c) => c.types.includes('country'))
    const region = addressComponents.find((c) =>
      c.types.includes('administrative_area_level_1')
    )

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      country: country?.longText,
      region: region?.longText
    }
  })

export class GooglePlacesGateway extends BaseGoogleGateway {
  path = '' // Not used for new API, but required by base class
  subdomain = 'places'

  async search(
    query: string,
    sessiontoken: string
  ): Promise<GooglePlaceResult[]> {
    const response = await this.request(
      '/v1/places:autocomplete',
      {
        input: query,
        includedPrimaryTypes: [
          'locality',
          'administrative_area_level_1',
          'administrative_area_level_2',
          'country'
        ],
        sessionToken: sessiontoken
      },
      {
        method: 'POST',
        useHeaderAuth: true,
        headers: {
          'X-Goog-FieldMask':
            'suggestions.placePrediction.text,suggestions.placePrediction.placeId'
        }
      }
    )

    if (!response.ok) {
      captureException(new Error('Google Places autocomplete request failed'), {
        data: {
          status: response.status,
          statusText: response.statusText,
          body: await response.text()
        }
      })
      return []
    }

    const result = await response.json()
    console.log(result)
    const parsed = autocompleteSchema.safeParse(result)

    return parsed.data || []
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    const response = await this.request(
      `/v1/places/${placeId}`,
      {},
      {
        method: 'GET',
        useHeaderAuth: true,
        headers: {
          'X-Goog-FieldMask': 'location,addressComponents'
        }
      }
    )

    if (!response.ok) return null

    const result = await response.json()
    const parsed = placeDetailsSchema.safeParse(result)

    return parsed.data || null
  }
}

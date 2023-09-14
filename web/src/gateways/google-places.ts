import { z } from 'zod'
import { BaseGoogleGateway } from './google/base-gateway'

export type GooglePlaceResult = z.infer<typeof volumeSchema>

const volumeSchema = z.object({
  description: z.string(),
  place_id: z.string(),
  structured_formatting: z.object({
    main_text: z.string(),
    secondary_text: z.string()
  })
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
    console.log(response.url)
    if (!response.ok) return []
    const result = await response.json()

    return z
      .object({ predictions: z.array(volumeSchema).default([]) })
      .parse(result).predictions
  }
}

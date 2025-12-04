'use server'

import { GooglePlacesGateway } from '@books-about-food/core/gateways/google-places'
import { stringify } from 'src/utils/superjson'

const places = new GooglePlacesGateway()

export async function search(query: string, token: string) {
  if (query.length < 2) {
    return stringify([])
  }

  const result = await places.search(query, token)

  return stringify(
    result.map(({ description, place_id }) => ({
      displayText: description,
      placeId: place_id,
      id: place_id
    }))
  )
}

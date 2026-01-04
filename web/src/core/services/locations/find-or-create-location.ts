import { slugify } from '@books-about-food/shared/utils/slugify'
import z from 'zod'
import { GooglePlacesGateway } from '../../gateways/google-places'
import { Location } from '../../models/location'
import { Service } from '../base'
import { LOCATION_DEPTH } from '../utils/payload-depth'

const places = new GooglePlacesGateway()

export const findOrCreateLocation = new Service(
  z.object({
    placeId: z.string(),
    displayText: z.string()
  }),
  async function ({ placeId, displayText }, { payload }) {
    // Try to find existing location
    const { docs } = await payload.find({
      collection: 'locations',
      where: { placeId: { equals: placeId } },
      limit: 1,
      depth: LOCATION_DEPTH
    })

    if (docs[0]) return new Location(docs[0])

    // Fetch details from Google Places API
    const details = await places.getPlaceDetails(placeId)
    if (!details) return null

    // Create new location
    const created = await payload.create({
      collection: 'locations',
      data: {
        placeId,
        displayText,
        slug: slugify(displayText),
        ...details
      },
      depth: LOCATION_DEPTH
    })

    return new Location(created)
  }
)

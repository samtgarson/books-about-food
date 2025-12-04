import prisma from '@books-about-food/database'
import z from 'zod'
import { GooglePlacesGateway } from '../../gateways/google-places'
import { Location } from '../../models/location'
import { Service } from '../base'

const places = new GooglePlacesGateway()

export const findOrCreateLocation = new Service(
  z.object({
    placeId: z.string(),
    displayText: z.string()
  }),
  async function ({ placeId, displayText }) {
    const existing = await prisma.location.findUnique({
      where: { placeId }
    })

    if (existing) return new Location(existing)

    const details = await places.getPlaceDetails(placeId)

    const created = await prisma.location.create({
      data: {
        placeId,
        displayText,
        country: details?.country,
        region: details?.region,
        latitude: details?.latitude,
        longitude: details?.longitude
      }
    })

    return new Location(created)
  }
)

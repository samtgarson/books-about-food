import prisma from '@books-about-food/database'
import z from 'zod'
import { GooglePlacesGateway } from '../../gateways/google-places'
import { Location } from '../../models/location'
import { Service } from '../base'
import { locationIncludes } from '../utils'

const places = new GooglePlacesGateway()

export const findOrCreateLocation = new Service(
  z.object({
    placeId: z.string(),
    displayText: z.string()
  }),
  async function ({ placeId, displayText }) {
    const existing = await prisma.location.findUnique({
      where: { placeId },
      include: locationIncludes
    })

    if (existing) return new Location(existing)

    const details = await places.getPlaceDetails(placeId)
    if (!details) return null

    const created = await prisma.location.create({
      data: {
        placeId,
        displayText,
        ...details
      },
      include: locationIncludes
    })

    return new Location(created)
  }
)

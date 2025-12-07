import prisma from '@books-about-food/database'
import z from 'zod'
import { Location } from '../../models/location'
import { Service } from '../base'
import { locationIncludes } from '../utils'

export const fetchLocations = new Service(
  z.undefined(),
  async function (): Promise<Location[]> {
    const locations = await prisma.location.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null }
      },
      include: locationIncludes
    })

    return locations.map((location) => new Location(location))
  },
  { cache: 'locations' }
)

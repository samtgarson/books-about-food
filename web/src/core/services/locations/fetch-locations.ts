import prisma from '@books-about-food/database'
import { LocationWhereInput } from '@books-about-food/database/client'
import z from 'zod'
import { Location } from '../../models/location'
import { Service } from '../base'
import { locationIncludes } from '../utils'

export const fetchLocations = new Service(
  z.object({
    hasProfiles: z.boolean().optional()
  }),
  async function ({ hasProfiles = false }, _ctx): Promise<Location[]> {
    const where: LocationWhereInput = {}
    if (hasProfiles) where.profiles = { some: {} }

    const locations = await prisma.location.findMany({
      where,
      include: locationIncludes
    })

    return locations.map((location) => new Location(location))
  },
  { cache: 'locations' }
)

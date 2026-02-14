import { Where } from 'payload'
import z from 'zod'
import { Location } from '../../models/location'
import { Service } from '../base'
import { LOCATION_DEPTH } from '../utils/payload-depth'

export const fetchLocations = new Service(
  z.object({
    hasProfiles: z.boolean().optional()
  }),
  async function ({ hasProfiles = false }, { payload }): Promise<Location[]> {
    const where: Where = {}
    if (hasProfiles) {
      where.profiles = { exists: true }
    }

    const { docs } = await payload.find({
      collection: 'locations',
      where,
      depth: LOCATION_DEPTH
    })

    return docs.map((location) => new Location(location))
  },
  { cache: 'locations' }
)

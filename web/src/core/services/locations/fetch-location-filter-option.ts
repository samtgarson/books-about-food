import z from 'zod'
import { Service } from '../base'

export const fetchLocationFilterOption = new Service(
  z.object({ id: z.string() }),
  async function ({ id }, { payload }) {
    return await payload.findByID({
      collection: 'location-filter-options',
      id
    })
  }
)

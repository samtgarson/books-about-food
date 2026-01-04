import { can } from 'src/core/policies'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'

export const destroyMembership = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id }, { payload, user }) {
    // Find publisher that has this membership
    const { docs } = await payload.find({
      collection: 'publishers',
      where: {
        'memberships.id': { equals: id }
      },
      limit: 1,
      depth: PUBLISHER_DEPTH,
      user
    })

    if (!docs[0]) throw new AppError('NotFound', 'Membership not found')

    // Check authorization
    if (!can(user, new Publisher(docs[0])).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to destroy this membership'
      )
    }

    // Delete membership
    await payload.delete({
      collection: 'memberships',
      id,
      user
    })
  }
)

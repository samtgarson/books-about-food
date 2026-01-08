import { can } from 'src/core/policies'
import { enum_memberships_role } from 'src/payload/schema'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'

export const updateMembership = new AuthedService(
  z.object({
    membershipId: z.string(),
    role: z.enum(enum_memberships_role.enumValues)
  }),
  async function ({ membershipId, role }, { payload, user }) {
    // Find publisher that has this membership
    const { docs } = await payload.find({
      collection: 'publishers',
      where: {
        'memberships.id': { equals: membershipId }
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
        'You are not allowed to update this membership'
      )
    }

    // Update membership role
    await payload.update({
      collection: 'memberships',
      id: membershipId,
      data: { role },
      user
    })
  }
)

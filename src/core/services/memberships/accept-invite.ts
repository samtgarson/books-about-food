import z from 'zod'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'

export const acceptInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId }, { payload, user }) {
    // Find invitation for this user's email
    const { docs } = await payload.find({
      collection: 'publisher-invitations',
      where: {
        and: [{ id: { equals: inviteId } }, { email: { equals: user.email } }]
      },
      limit: 1,
      depth: 1,
      user
    })

    if (!docs[0]) {
      throw new AppError('NotFound', 'Invitation not found')
    }

    const invite = docs[0]
    const publisherId =
      typeof invite.publisher === 'string'
        ? invite.publisher
        : invite.publisher.id

    // Update invitation to mark as accepted
    await payload.update({
      collection: 'publisher-invitations',
      id: inviteId,
      data: { acceptedAt: new Date().toISOString() },
      user
    })

    // Create membership
    await payload.create({
      collection: 'memberships',
      data: {
        publisher: publisherId,
        user: user.id,
        role: invite.role
      },
      user
    })
  }
)

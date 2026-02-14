import type { Membership } from 'src/payload/payload-types'
import z from 'zod'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'

export const deleteInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId }, { payload, user }) {
    // Find the invitation with publisher and memberships
    const invite = await payload.findByID({
      collection: 'publisher-invitations',
      id: inviteId,
      depth: 2,
      user
    })

    if (!invite) {
      throw new AppError('NotFound', 'Invitation not found')
    }

    // Check if user owns the invite or is publisher admin
    const ownInvite = invite.email === user.email

    const publisher =
      typeof invite.publisher === 'string' ? null : invite.publisher
    const memberships =
      typeof publisher?.memberships === 'object'
        ? publisher.memberships.docs
        : []

    const adminOfPublisher = memberships?.find((m: string | Membership) => {
      if (typeof m === 'string') return false
      const userId = typeof m.user === 'string' ? m.user : m.user?.id
      return userId === user.id && m.role === 'admin'
    })

    if (!ownInvite && !adminOfPublisher) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to delete this invite'
      )
    }

    await payload.delete({
      collection: 'publisher-invitations',
      id: inviteId,
      user
    })
  }
)

import { Where } from 'payload'
import z from 'zod'
import { Invitation } from '../../models/invitation'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { INVITATION_DEPTH } from '../utils/payload-depth'

export const fetchInvitations = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug }, { payload, user }) {
    // Check if user is a member using user.publishers
    if (!user.publishers.includes(slug)) {
      throw new AppError('Forbidden', 'You are not a member of this publisher')
    }

    // Get pending invitations for this publisher using slug
    const { docs: invitations } = await payload.find({
      collection: 'invitations',
      where: {
        and: [
          { 'publisher.slug': { equals: slug } },
          { acceptedAt: { equals: null } }
        ]
      } as Where,
      depth: INVITATION_DEPTH,
      pagination: false,
      user
    })

    return invitations.map((i) => new Invitation(i))
  }
)

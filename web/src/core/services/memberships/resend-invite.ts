import z from 'zod'
import { inngest } from '../../jobs'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'

export const resendInvite = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id }, { payload, user }) {
    // Find publisher with this invitation where user is the inviter and a member
    const { docs } = await payload.find({
      collection: 'publishers',
      where: {
        and: [
          { 'invitations.id': { equals: id } },
          { 'invitations.invitedBy': { equals: user.id } },
          { 'memberships.user': { equals: user.id } }
        ]
      },
      limit: 1,
      depth: PUBLISHER_DEPTH,
      user
    })

    if (!docs[0]) {
      throw new AppError('NotFound', 'Publisher not found')
    }

    const publisher = docs[0]

    // Check authorization
    if (!can(user, new Publisher(publisher)).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this publisher.'
      )
    }

    // Get the invitation to find the email
    const invite = await payload.findByID({
      collection: 'publisher-invitations',
      id,
      depth: 0,
      user
    })

    if (!invite) {
      throw new AppError('NotFound', 'Invitation not found')
    }

    // Resend email
    inngest.send({
      name: 'jobs.email',
      data: {
        key: 'publisherInvite',
        props: {
          inviterName: user.name || user.email,
          publisherName: publisher.name
        }
      },
      user: { email: invite.email }
    })
  }
)

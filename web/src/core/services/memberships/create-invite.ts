import { inngest } from '../../jobs'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { PUBLISHER_DEPTH } from '../utils/payload-depth'
import { createInviteSchema } from './schemas/create-invite'

export const createInvite = new AuthedService(
  createInviteSchema,
  async function ({ publisherId, email, role }, { payload, user }) {
    // Find publisher and verify user is a member
    const { docs } = await payload.find({
      collection: 'publishers',
      where: {
        and: [
          { id: { equals: publisherId } },
          { 'memberships.user': { equals: user.id } }
        ]
      },
      limit: 1,
      depth: PUBLISHER_DEPTH,
      user
    })

    if (!docs[0]) throw new AppError('NotFound', 'Publisher not found')

    // Check authorization
    if (!can(user, new Publisher(docs[0])).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this publisher.'
      )
    }

    // Create invitation
    const invite = await payload.create({
      collection: 'publisher-invitations',
      data: {
        publisher: publisherId,
        email,
        role,
        invitedBy: user.id
      },
      depth: 1,
      user
    })

    // Send email notification
    inngest.send({
      name: 'jobs.email',
      data: {
        key: 'publisherInvite',
        props: {
          inviterName: user.name || user.email,
          publisherName: docs[0].name
        }
      },
      user: { email }
    })

    return invite
  }
)

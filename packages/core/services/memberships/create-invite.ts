import prisma from '@books-about-food/database'
import { inngest } from '../../jobs'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'
import { createInviteSchema } from './schemas/create-invite'

export const createInvite = new AuthedService(
  createInviteSchema,
  async function ({ publisherId, email, role } = {}, user) {
    const publisher = await prisma.publisher.findUnique({
      where: { id: publisherId, memberships: { some: { userId: user.id } } },
      include: publisherIncludes
    })

    if (!publisher) throw new AppError('NotFound', 'Publisher not found')
    if (!can(user, new Publisher(publisher)).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this publisher.'
      )
    }

    const invite = await prisma.publisherInvitation.create({
      data: {
        publisherId,
        email,
        role,
        invitedById: user.id
      },
      include: { publisher: { select: { name: true } } }
    })

    inngest.send({
      name: 'jobs.email',
      data: {
        key: 'publisherInvite',
        props: {
          inviterName: user.name || user.email,
          publisherName: invite.publisher.name
        }
      },
      user: { email }
    })

    return invite
  }
)

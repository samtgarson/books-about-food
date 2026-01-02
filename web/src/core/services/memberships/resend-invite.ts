import prisma from '@books-about-food/database'
import z from 'zod'
import { inngest } from '../../jobs'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const resendInvite = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id }, { user }) {
    const publisher = await prisma.publisher.findFirst({
      where: {
        invitations: { some: { id, invitedById: user.id } },
        memberships: { some: { userId: user.id } }
      },
      include: { ...publisherIncludes, invitations: true }
    })
    const invite = publisher?.invitations.find((i) => i.id === id)

    if (!publisher || !invite)
      throw new AppError('NotFound', 'Publisher not found')
    if (!can(user, new Publisher(publisher)).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this publisher.'
      )
    }

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

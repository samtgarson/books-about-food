import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'

export const deleteInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId }, user) {
    const invite = await prisma.publisherInvitation.findUniqueOrThrow({
      where: { id: inviteId },
      include: { publisher: { include: { memberships: true } } }
    })

    const ownInvite = invite.email === user.email
    const adminOfPublisher = invite.publisher.memberships.find(
      (m) => m.userId === user.id && m.role === 'admin'
    )

    if (!ownInvite && !adminOfPublisher)
      throw new AppError(
        'Forbidden',
        'You do not have permission to delete this invite'
      )

    await prisma.publisherInvitation.delete({ where: { id: inviteId } })
  }
)

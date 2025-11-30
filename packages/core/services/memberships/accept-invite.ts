import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'

export const acceptInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId }, user) {
    const invite = await prisma.publisherInvitation.findUniqueOrThrow({
      where: { id: inviteId, email: user.email },
      include: { publisher: true }
    })

    await prisma.$transaction(async function (tx) {
      await tx.publisherInvitation.update({
        where: { id: inviteId },
        data: { acceptedAt: new Date() }
      })
      await tx.membership.create({
        data: {
          publisherId: invite.publisher.id,
          userId: user.id
        }
      })
    })
  }
)

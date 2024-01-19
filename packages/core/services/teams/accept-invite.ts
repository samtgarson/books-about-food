import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'

export const acceptInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId } = {}, user) {
    const invite = await prisma.teamInvitation.findUniqueOrThrow({
      where: { id: inviteId, email: user.email },
      include: { team: true }
    })

    await prisma.$transaction([
      prisma.teamInvitation.update({
        where: { id: inviteId },
        data: { acceptedAt: new Date() }
      }),
      prisma.membership.create({
        data: {
          team: { connect: invite.team },
          user: { connect: user }
        }
      })
    ])
  }
)

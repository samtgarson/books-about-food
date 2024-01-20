import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'

export const deleteInvite = new AuthedService(
  z.object({ inviteId: z.string() }),
  async function ({ inviteId } = {}, user) {
    const invite = await prisma.teamInvitation.findUniqueOrThrow({
      where: { id: inviteId },
      include: { team: { include: { memberships: true } } }
    })

    const ownInvite = invite.email === user.email
    const adminOfTeam = invite.team.memberships.find(
      (m) => m.userId === user.id && m.role === 'admin'
    )

    if (!ownInvite && !adminOfTeam)
      throw new AppError(
        'Forbidden',
        'You do not have permission to delete this invite'
      )

    await prisma.teamInvitation.delete({ where: { id: inviteId } })
  }
)

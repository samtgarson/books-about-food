import prisma from '@books-about-food/database'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { createInviteSchema } from './schemas/create-invite'

export const createInvite = new AuthedService(
  createInviteSchema,
  async function ({ teamId, email, role } = {}, user) {
    const membership = await prisma.membership.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } }
    })

    if (membership?.role !== 'admin') {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this team.'
      )
    }

    const invite = await prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        role,
        invitedById: user.id
      }
    })

    return invite
  }
)

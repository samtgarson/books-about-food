import prisma from '@books-about-food/database'
import z from 'zod'
import { inngest } from '../../jobs'
import { Team } from '../../models/team'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { teamIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const resendInvite = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id } = {}, user) {
    const team = await prisma.team.findFirst({
      where: {
        invitations: { some: { id, invitedById: user.id } },
        memberships: { some: { userId: user.id } }
      },
      include: teamIncludes
    })
    const invite = team?.invitations.find((i) => i.id === id)

    if (!team || !invite) throw new AppError('NotFound', 'Team not found')
    if (!can(user, new Team(team)).update) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to invite to this team.'
      )
    }

    inngest.send({
      name: 'jobs.email',
      data: {
        key: 'teamInvite',
        props: {
          inviterName: user.name || user.email,
          teamName: team.name
        }
      },
      user: { email: invite.email }
    })
  }
)

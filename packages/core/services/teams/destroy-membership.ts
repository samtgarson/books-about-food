import { Team } from '@books-about-food/core/models/team'
import { can } from '@books-about-food/core/policies'
import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { teamIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const destroyMembership = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id } = {}, user) {
    const team = await prisma.team.findFirst({
      where: { memberships: { some: { id } } },
      include: teamIncludes
    })

    if (!team) throw new AppError('NotFound', 'Membership not found')
    if (!can(user, new Team(team)).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to destroy this membership'
      )
    }

    await prisma.membership.delete({ where: { id } })
  }
)

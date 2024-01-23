import { Team } from '@books-about-food/core/models/team'
import { can } from '@books-about-food/core/policies'
import prisma, { MembershipRole } from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { teamIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const updateMembership = new AuthedService(
  z.object({ membershipId: z.string(), role: z.nativeEnum(MembershipRole) }),
  async function ({ membershipId, role } = {}, user) {
    const team = await prisma.team.findFirst({
      where: { memberships: { some: { id: membershipId } } },
      include: teamIncludes
    })

    if (!team) throw new AppError('NotFound', 'Membership not found')
    if (!can(user, new Team(team)).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to update this membership'
      )
    }

    await prisma.membership.update({
      where: { id: membershipId },
      data: { role }
    })
  }
)

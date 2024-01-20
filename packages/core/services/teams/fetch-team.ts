import { Team } from '@books-about-food/core/models/team'
import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { teamIncludes } from '../utils'

export const fetchTeam = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug } = {}, user) {
    const team = await prisma.team.findUnique({
      where: {
        slug,
        memberships: { some: { userId: user.id } }
      },
      include: teamIncludes
    })

    if (!team) return null
    return new Team(team)
  }
)

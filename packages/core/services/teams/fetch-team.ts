import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'

export const fetchTeam = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug } = {}, user) {
    const team = await prisma.team.findUnique({
      where: {
        slug,
        memberships: { some: { userId: user.id } }
      },
      include: {
        memberships: {
          where: { userId: user.id }
        }
      }
    })

    return team
  }
)

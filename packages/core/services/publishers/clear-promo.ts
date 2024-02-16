import prisma from '@books-about-food/database'
import z from 'zod'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'

export const clearPromo = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id } = {}, user) {
    const existing = await prisma.promo.findUniqueOrThrow({
      where: { id },
      include: { publisher: true }
    })

    if (
      !existing.publisher.teamId ||
      !user.teams.includes(existing.publisher.teamId)
    ) {
      throw new AppError(
        'Forbidden',
        'You do not have permission to clear this promo'
      )
    }

    await prisma.promo.update({
      where: { id },
      data: { until: new Date() }
    })

    return existing
  }
)

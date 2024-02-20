import prisma from '@books-about-food/database'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { can } from '../../policies'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const clearPromo = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id } = {}, user) {
    const existing = await prisma.promo.findUniqueOrThrow({
      where: { id },
      include: { publisher: { include: publisherIncludes } }
    })
    const publisher = new Publisher(existing.publisher)

    if (!can(user, publisher).update) {
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

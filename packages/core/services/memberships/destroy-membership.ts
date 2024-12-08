import { can } from '@books-about-food/core/policies'
import prisma from '@books-about-food/database'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const destroyMembership = new AuthedService(
  z.object({ id: z.string() }),
  async function ({ id } = {}, user) {
    const publisher = await prisma.publisher.findFirst({
      where: { memberships: { some: { id } } },
      include: publisherIncludes
    })

    if (!publisher) throw new AppError('NotFound', 'Membership not found')
    if (!can(user, new Publisher(publisher)).update) {
      throw new AppError(
        'Forbidden',
        'You are not allowed to destroy this membership'
      )
    }

    await prisma.membership.delete({ where: { id } })
  }
)

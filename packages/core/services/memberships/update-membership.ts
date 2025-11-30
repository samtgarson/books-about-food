import { can } from '@books-about-food/core/policies'
import prisma, { MembershipRole } from '@books-about-food/database'
import z from 'zod'
import { Publisher } from '../../models/publisher'
import { AuthedService } from '../base'
import { publisherIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const updateMembership = new AuthedService(
  z.object({ membershipId: z.string(), role: z.enum(MembershipRole) }),
  async function ({ membershipId, role }, user) {
    const publisher = await prisma.publisher.findFirst({
      where: { memberships: { some: { id: membershipId } } },
      include: publisherIncludes
    })

    if (!publisher) throw new AppError('NotFound', 'Membership not found')
    if (!can(user, new Publisher(publisher)).update) {
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

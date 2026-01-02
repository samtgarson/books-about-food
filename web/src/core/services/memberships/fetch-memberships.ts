import prisma from '@books-about-food/database'
import z from 'zod'
import { Membership } from '../../models/membership'
import { AuthedService } from '../base'
import { membershipIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const fetchMemberships = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug }, { user }) {
    const memberships = await prisma.membership.findMany({
      where: { publisher: { slug } },
      include: membershipIncludes
    })

    const isMember = memberships.some((m) => m.userId === user.id)
    if (!isMember) {
      throw new AppError('Forbidden', 'You are not a member of this publisher')
    }

    return memberships.map((m) => new Membership(m))
  }
)

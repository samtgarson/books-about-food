import prisma from '@books-about-food/database'
import z from 'zod'
import { Invitation } from '../../models/invitation'
import { AuthedService } from '../base'
import { invitationIncludes } from '../utils'
import { AppError } from '../utils/errors'

export const fetchInvitations = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug }, user) {
    const publisher = await prisma.publisher.findUnique({
      where: { slug },
      include: {
        memberships: { where: { userId: user.id } },
        invitations: {
          include: invitationIncludes,
          where: { acceptedAt: null }
        }
      }
    })

    if (!publisher) throw new AppError('NotFound', 'Publisher not found')
    const isMember = publisher?.memberships.length > 0
    if (!isMember) {
      throw new AppError('Forbidden', 'You are not a member of this publisher')
    }

    return publisher.invitations.map((m) => new Invitation(m))
  }
)

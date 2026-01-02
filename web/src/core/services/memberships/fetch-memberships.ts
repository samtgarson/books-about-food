import z from 'zod'
import { Membership } from '../../models/membership'
import { AuthedService } from '../base'
import { AppError } from '../utils/errors'
import { MEMBERSHIP_DEPTH } from '../utils/payload-depth'

export const fetchMemberships = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug }, { payload, user }) {
    // Check if user is a member using user.publishers
    if (!user.publishers.includes(slug)) {
      throw new AppError('Forbidden', 'You are not a member of this publisher')
    }

    // Find all memberships for this publisher
    const { docs: memberships } = await payload.find({
      collection: 'memberships',
      where: { 'publisher.slug': { equals: slug } },
      depth: MEMBERSHIP_DEPTH,
      pagination: false,
      user
    })

    return memberships.map((m) => new Membership(m))
  }
)

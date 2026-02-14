import { can } from 'src/core/policies'
import z from 'zod'
import { Membership } from '../../models/membership'
import { AuthedService } from '../base'
import { fetchPublisher } from '../publishers/fetch-publisher'
import { AppError } from '../utils/errors'
import { MEMBERSHIP_DEPTH } from '../utils/payload-depth'

export const fetchMemberships = new AuthedService(
  z.object({ slug: z.string() }),
  async function ({ slug }, { payload, user }) {
    const { data: publisher } = await fetchPublisher.call({ slug }, { payload })

    if (!publisher) {
      throw new AppError('NotFound', 'Publisher not found')
    }
    // Check if user is a member using user.publishers
    if (!can(user, publisher).update) {
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

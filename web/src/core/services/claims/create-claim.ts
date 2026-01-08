import { AuthedService } from 'src/core/services/base'
import { generate } from 'src/core/services/utils/passphrase'
import { z } from 'zod'
import { inngest } from '../../jobs'

export const createClaim = new AuthedService(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId }, { payload, user }) => {
    if (!user?.email) return null
    if (!profileId) return null

    const secret = generate({
      length: 3,
      numbers: false,
      titlecase: true,
      separator: ' '
    })

    const claim = await payload.create({
      collection: 'claims',
      data: {
        profile: profileId,
        user: user.id,
        secret,
        state: 'pending'
      },
      depth: 2 // Include profile with avatar
    })

    const profile = typeof claim.profile === 'object' ? claim.profile : null
    const resourceName = profile?.name || 'Unknown'

    await inngest.send({
      name: 'jobs.email',
      data: {
        key: 'newClaim',
        props: {
          claimId: claim.id,
          resourceName,
          resourceAvatar: null,
          userEmail: user.email
        }
      },
      user: { name: 'BAF Admins', email: 'jamin@booksabout.food' }
    })

    return claim
  }
)

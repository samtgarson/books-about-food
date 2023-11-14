import { inngest } from 'core/gateways/inngest'
import { Service } from 'core/services/base'
import { generate } from 'core/services/utils/passphrase'
import prisma from 'database'
import { z } from 'zod'

export const createClaim = new Service(
  z.object({
    profileId: z.string()
  }),
  async ({ profileId } = {}, user) => {
    if (!user) return null
    if (!profileId) return null

    const userId = user.id
    const secret = generate({
      length: 3,
      numbers: false,
      titlecase: true,
      separator: ' '
    })

    const { profile, ...claim } = await prisma.claim.create({
      data: {
        profileId,
        userId,
        secret
      },
      include: {
        profile: { include: { avatar: true } }
      }
    })

    const resourceName = profile.name

    await inngest.send({
      name: 'email',
      data: {
        key: 'newClaim',
        props: {
          claimId: claim.id,
          recipientName: 'Admin',
          resourceName: resourceName as string,
          resourceAvatar: null
        }
      },
      user: { email: 'aboutcookbooks@gmail.com' }
    })
    return claim
  }
)

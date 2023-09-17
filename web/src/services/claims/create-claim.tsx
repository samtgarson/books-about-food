import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { send } from 'email'
import { generate } from 'src/utils/passphrase'

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

    const claim = await prisma.claim.create({
      data: {
        profileId,
        userId,
        secret
      },
      include: {
        profile: { include: { avatar: true } }
      }
    })

    const resourceName = claim.profile.name

    await send('new-claim', 'aboutcookbooks@gmail.com', {
      claimId: claim.id,
      recipientName: 'Admin',
      resourceName: resourceName as string,
      resourceAvatar: null
    })
    return claim
  }
)

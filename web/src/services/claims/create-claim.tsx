import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import sendMail, { NewClaim } from 'email/src'
import { generate } from 'src/utils/passphrase'

export const createClaim = new Service(
  z
    .object({
      profileId: z.string(),
      publisherId: z.never().optional()
    })
    .or(
      z.object({
        publisherId: z.string(),
        profileId: z.never().optional()
      })
    ),
  async ({ profileId, publisherId } = {}, user) => {
    if (!user) return null
    if (!profileId && !publisherId) return null

    const userId = user.id
    const secret = generate({
      length: 3,
      numbers: false,
      titlecase: true,
      fast: true,
      separator: ' '
    })

    const claim = await prisma.claim.create({
      data: {
        profileId,
        publisherId,
        userId,
        secret
      },
      include: {
        profile: { include: { avatar: true } },
        publisher: { include: { logo: true } }
      }
    })

    const resourceName = claim.profile?.name || claim.publisher?.name
    const type = claim.profile ? 'profile' : 'publisher'

    await sendMail({
      component: (
        <NewClaim
          claimId={claim.id}
          recipientName="Admin"
          resourceName={resourceName as string}
          type={type}
          resourceAvatar={null}
        />
      ),
      to: 'aboutcookbooks@gmail.com'
    })
    return claim
  }
)

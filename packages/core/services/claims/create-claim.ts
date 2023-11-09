import { sendEmail } from 'core/gateways/email'
import { Service } from 'core/services/base'
import { generate } from 'core/services/utils/passphrase'
import prisma from 'database'
import { EmailTemplate } from 'email'
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

    await sendEmail(EmailTemplate.NewClaim, 'aboutcookbooks@gmail.com', {
      claimId: claim.id,
      recipientName: 'Admin',
      resourceName: resourceName as string,
      resourceAvatar: null
    })
    return claim
  }
)

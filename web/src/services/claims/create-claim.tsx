import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { EmailTemplate } from 'email'
import { generate } from 'src/utils/passphrase'
import { sendEmail } from 'src/pages/api/email'

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

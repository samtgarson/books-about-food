import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { generate } from 'generate-passphrase'

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

    return prisma.claim.create({
      data: {
        profileId,
        publisherId,
        userId,
        secret
      }
    })
  }
)

import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type ToggleContributionVisibilityInput = z.infer<
  typeof toggleContributionVisibility.input
>

export const toggleContributionVisibility = new Service(
  z.object({
    profileId: z.string(),
    bookId: z.string(),
    hidden: z.boolean()
  }),
  async ({ profileId, bookId, hidden } = {}) => {
    await prisma.contribution.updateMany({
      where: { profileId, bookId },
      data: { hidden }
    })
  }
)

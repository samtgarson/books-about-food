import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
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

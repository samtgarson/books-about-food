import { Service } from 'src/core/services/base'
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
  async ({ profileId, bookId, hidden }, { payload }) => {
    // Find all contributions matching the profile and book
    const { docs } = await payload.find({
      collection: 'contributions',
      where: {
        and: [{ profile: { equals: profileId } }, { book: { equals: bookId } }]
      }
    })

    // Update each contribution
    await Promise.all(
      docs.map((contribution) =>
        payload.update({
          collection: 'contributions',
          id: contribution.id,
          data: { hidden }
        })
      )
    )
  }
)

import { extractId } from 'src/core/models/utils/payload-validation'
import { AuthedService } from 'src/core/services/base'
import { Book } from 'src/payload/payload-types'
import { z } from 'zod'

export type ToggleContributionVisibilityInput = z.infer<
  typeof toggleContributionVisibility.input
>

export const toggleContributionVisibility = new AuthedService(
  z.object({
    profileId: z.string(),
    bookId: z.string(),
    hidden: z.boolean()
  }),
  async ({ profileId, bookId, hidden }, { payload, user }) => {
    const book = await payload.findByID({
      collection: 'books',
      id: bookId,
      depth: 0
    })

    const contributions = buildContributions(book, profileId, hidden)

    await payload.update({
      collection: 'books',
      id: bookId,
      data: { contributions },
      user
    })
  }
)

function buildContributions(book: Book, profileId: string, hidden: boolean) {
  return book.contributions?.map((contribution) => {
    const matching = extractId(contribution.profile) === profileId
    return {
      ...contribution,
      hidden: matching ? hidden : contribution.hidden
    }
  })
}

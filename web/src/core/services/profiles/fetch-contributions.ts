import { Where } from 'payload'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export type FetchContributionsInput = z.infer<typeof fetchContributions.input>
export type FetchContributionsOutput = Awaited<
  ReturnType<typeof fetchContributions.call>
>

export const fetchContributions = new Service(
  z.object({
    profileId: z.string(),
    bookId: z.string().optional()
  }),
  async ({ profileId, bookId }, { payload }) => {
    // Build where clause
    const where: Where = {
      profile: { equals: profileId }
    }

    if (bookId) {
      where.book = { equals: bookId }
    }

    // Fetch contributions with job details
    const { docs } = await payload.find({
      collection: 'contributions',
      where,
      depth: 1, // Populate job
      pagination: false
    })

    return docs
  }
)

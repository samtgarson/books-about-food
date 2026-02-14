import { BasePayload } from 'payload'
import { BookContribution } from 'src/core/models/types'
import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

const contributorSchema = z.object({
  profileId: z.string(),
  jobName: z.string(),
  assistant: z.boolean().optional()
})

export type ContributorAttrs = z.infer<typeof contributorSchema>

export const updateContributors = new AuthedService(
  z.object({
    slug: z.string(),
    contributors: contributorSchema.array().nullish()
  }),
  async ({ slug, contributors }, { payload, user }) => {
    // Find book by slug
    const {
      docs: [book]
    } = await payload.find({
      collection: 'books',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0
    })

    if (!book) throw new Error('Book not found')
    const bookId = book.id

    // If no contributors, clear the contributions array
    if (!contributors) {
      await payload.update({
        collection: 'books',
        id: bookId,
        data: { contributions: [] },
        user
      })
      return
    }

    // Fetch existingJobs for all contributions
    const existingJobsMap = await fetchExistingJobs(payload, contributors)

    // Build contributions array
    const contributionsData = await Promise.all(
      contributors.map(async function ({
        profileId,
        jobName,
        assistant = false
      }): Promise<BookContribution> {
        // Find or create job

        let jobId: string
        if (existingJobsMap[jobName]) {
          jobId = existingJobsMap[jobName]
        } else {
          const newJob = await payload.create({
            collection: 'jobs',
            data: { name: jobName },
            depth: 0,
            user
          })
          jobId = newJob.id
        }

        return {
          profile: profileId,
          job: jobId,
          tag: assistant ? 'Assistant' : undefined
        }
      })
    )

    // Update book with new contributions array
    await payload.update({
      collection: 'books',
      id: bookId,
      data: { contributions: contributionsData },
      user
    })
  }
)

async function fetchExistingJobs(
  payload: BasePayload,
  contributors: ContributorAttrs[]
) {
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      name: {
        in: contributors.map((c) => c.jobName)
      }
    },
    depth: 0,
    limit: contributors.length
  })

  return docs.reduce(
    (map, job) => ({ ...map, [job.name]: job.id }),
    {} as Record<string, string>
  )
}

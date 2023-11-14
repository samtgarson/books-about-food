import { Service } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { z } from 'zod'

const contributorSchema = z.object({
  profileId: z.string(),
  jobName: z.string(),
  assistant: z.boolean().optional()
})

export type ContributorAttrs = z.infer<typeof contributorSchema>

export const updateContributors = new Service(
  z.object({
    slug: z.string(),
    contributors: contributorSchema.array()
  }),
  async ({ slug, contributors } = [], user) => {
    if (!user) throw new Error('User is required')
    const book = await prisma.book.findUnique({
      where: { slug },
      include: { contributions: true }
    })
    if (!book) throw new Error('Book not found')
    const bookId = book.id

    const resources = await Promise.all(contributors.map(createProfileAndJob))
    const contributions = await Promise.all(resources.map(createContributions))

    await prisma.book.update({
      where: { slug },
      data: {
        contributions: {
          delete: book.contributions
            .filter((c) => contributions.every(({ id }) => id !== c.id))
            .map(({ id }) => ({ id })),
          connect: contributions.map(({ id }) => ({ id }))
        }
      }
    })

    async function createProfileAndJob({
      profileId,
      jobName,
      assistant = false
    }: z.infer<typeof contributorSchema>) {
      const job = await prisma.job.upsert({
        where: { name: jobName },
        create: { name: jobName },
        update: {}
      })
      return { profile: { id: profileId }, job, assistant }
    }

    async function createContributions({
      profile,
      job,
      assistant
    }: Awaited<ReturnType<typeof createProfileAndJob>>) {
      return prisma.contribution.upsert({
        where: {
          profileId_bookId_jobId: {
            profileId: profile.id,
            bookId: bookId,
            jobId: job.id
          }
        },
        create: {
          profile: { connect: { id: profile.id } },
          book: { connect: { id: bookId } },
          job: { connect: { id: job.id } },
          tag: assistant ? 'Assistant' : undefined
        },
        update: { tag: assistant ? 'Assistant' : undefined }
      })
    }
  }
)

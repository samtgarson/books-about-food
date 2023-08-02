import prisma, { Job, Profile } from 'database'
import { slugify } from 'shared/utils/slugify'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export const updateContributors = new Service(
  z.object({
    slug: z.string(),
    contributors: z
      .object({
        profileName: z.string(),
        jobName: z.string()
      })
      .array()
  }),
  async ({ slug, contributors } = [], user) => {
    if (!user) throw new Error('User is required')
    const book = await prisma.book.findUnique({
      where: { slug },
      include: { contributions: true }
    })
    if (!book) throw new Error('Book not found')

    const resources = await Promise.all(contributors.map(createProfileAndJob))
    const contributions = await Promise.all(
      resources.map(createContributions(book.id))
    )

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
  }
)

const createProfileAndJob = async ({
  profileName,
  jobName
}: {
  profileName: string
  jobName: string
}) => {
  const [profile, job] = await Promise.all([
    prisma.profile.upsert({
      where: { name: profileName },
      create: { name: profileName, slug: slugify(profileName) },
      update: {}
    }),
    prisma.job.upsert({
      where: { name: jobName },
      create: { name: jobName },
      update: {}
    })
  ])
  return { profile, job }
}

const createContributions =
  (bookId: string) =>
    ({ profile, job }: { profile: Profile; job: Job }) =>
      prisma.contribution.upsert({
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
          job: { connect: { id: job.id } }
        },
        update: {}
      })

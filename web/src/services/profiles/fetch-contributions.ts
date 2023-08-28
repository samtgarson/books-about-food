import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'

export type FetchContributionsInput = z.infer<typeof fetchContributions.input>
export type FetchContributionsOutput = Awaited<
  ReturnType<typeof fetchContributions.call>
>

export const fetchContributions = new Service(
  z.object({
    profileId: z.string(),
    bookId: z.string()
  }),
  async ({ profileId, bookId } = {}) => {
    const contributions = await prisma.contribution.findMany({
      where: { profileId, bookId },
      include: { job: { select: { name: true } } }
    })
    return contributions
  }
)

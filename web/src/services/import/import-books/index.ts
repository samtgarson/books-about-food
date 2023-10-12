import prisma from 'database'
import { asyncBatch } from 'src/services/utils/batch'
import { AppError } from 'src/services/utils/errors'
import { Service } from 'src/utils/service'
import { v4 as uuid } from 'uuid'
import z from 'zod'
import { extractBookAttrs, mapper } from './mapper'
import { parse } from './parse'
import { ImportRowError, ResultRow } from './types'

export type ImportBooksInput = z.infer<typeof importBooks.input>

export const importBooks = new Service(
  z.object({ csv: z.string() }),
  async ({ csv } = {}, user) => {
    if (user?.role !== 'admin') {
      throw new AppError('Forbidden', 'You must be an admin to import books')
    }

    const rows = await parse(csv)
    const jobs = (
      await prisma.job.findMany({
        select: { name: true },
        where: { name: { not: 'Publisher' } }
      })
    )
      .map((job) => job.name)
      .concat('Author')

    const results = await asyncBatch(
      rows,
      5,
      async function processRow(original): Promise<ResultRow | undefined> {
        if (!original.Title) return undefined

        const bookAttrs = await extractBookAttrs(original)
        const existing = await prisma.book.findUnique({
          where: { slug: bookAttrs.slug }
        })
        const errors: ImportRowError[] = existing ? ['Existing'] : []
        let result: ResultRow = {
          id: uuid(),
          bookAttrs,
          authors: [],
          contributors: [],
          errors
        }

        for (const key of Object.keys(original)) {
          result = await mapper(jobs, original, result, key)
        }

        return result
      }
    )

    return results
      .map((result, i) => {
        if (
          results.findIndex(
            (r) => r.bookAttrs.title === result.bookAttrs.title
          ) !== i
        ) {
          result.errors.push('Duplicate')
        }

        return result
      })
      .sort((a, b) => {
        return a.bookAttrs.title.localeCompare(b.bookAttrs.title)
      })
  }
)

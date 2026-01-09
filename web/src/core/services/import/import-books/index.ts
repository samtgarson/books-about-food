import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { AuthedService } from 'src/core/services/base'
import { AppError } from 'src/core/services/utils/errors'
import z from 'zod'
import { extractBookAttrs, mapper } from './mapper'
import { parse } from './parse'
import { ImportRowError, ResultRow } from './types'

export type ImportBooksInput = z.infer<typeof importBooks.input>

export const importBooks = new AuthedService(
  z.object({ csv: z.string() }),
  async ({ csv }, { user, payload }) => {
    if (user?.role !== 'admin') {
      throw new AppError('Forbidden', 'You must be an admin to import books')
    }

    const rows = await parse(csv)
    const { docs: jobDocs } = await payload.find({
      collection: 'jobs',
      where: {
        name: { not_equals: 'Publisher' }
      },
      limit: 1000,
      depth: 0
    })
    const jobs = jobDocs.map((job) => job.name).concat('Author')

    const results = await asyncBatch(
      rows,
      5,
      async function processRow(original): Promise<ResultRow | undefined> {
        if (!original.Title) return undefined

        const bookAttrs = await extractBookAttrs(original)
        const { docs } = await payload.find({
          collection: 'books',
          where: {
            slug: { equals: bookAttrs.slug }
          },
          limit: 1,
          depth: 0
        })
        const existing = docs[0]
        const errors: ImportRowError[] = existing ? ['Existing'] : []
        let result: ResultRow = {
          id: crypto.randomUUID(),
          bookAttrs,
          authors: [],
          contributors: [],
          errors
        }

        for (const key of Object.keys(original)) {
          result = await mapper(payload, jobs, original, result, key)
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

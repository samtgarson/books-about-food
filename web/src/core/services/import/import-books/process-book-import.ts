import prisma, { Prisma } from '@books-about-food/database'
import { asyncBatch } from '@books-about-food/shared/utils/batch'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { parse } from 'date-fns'
import { AuthedService } from 'src/core/services/base'
import { AppError } from 'src/core/services/utils/errors'
import z from 'zod'
import { inngest } from '../../../jobs'

export type ProcessBookImportInput = z.input<typeof processBookImport.input>

export const processBookImport = new AuthedService(
  z.object({
    books: z.array(
      z.object({
        id: z.string(),
        bookAttrs: z.object({
          title: z.string(),
          slug: z.string(),
          subtitle: z.string().optional(),
          releaseDate: z.string().optional(),
          pages: z.number().optional(),
          tags: z.array(z.string()).default([]),
          publisher: z.string().optional()
        }),
        authors: z.array(
          z.object({
            name: z.string(),
            id: z.string().optional()
          })
        ),
        contributors: z.array(
          z.object({
            job: z.string(),
            name: z.string(),
            id: z.string().optional()
          })
        )
      })
    )
  }),
  async ({ books }, { user }) => {
    if (user?.role !== 'admin') {
      throw new AppError('Forbidden', 'You must be an admin to import books')
    }

    const rows: { id: string; data: Prisma.BookCreateInput }[] = books.map(
      ({ id, bookAttrs, authors: authorsInput, contributors }) => {
        let publisher: Prisma.BookCreateInput['publisher']
        if (bookAttrs.publisher)
          publisher = {
            connectOrCreate: {
              where: { name: bookAttrs.publisher },
              create: {
                name: bookAttrs.publisher,
                slug: slugify(bookAttrs.publisher)
              }
            }
          }

        let authors: Prisma.BookCreateInput['authors']
        if (authorsInput.length)
          authors = {
            create: authorsInput
              .filter((author) => !author.id)
              .map((author) => ({
                name: author.name,
                slug: slugify(author.name)
              })),
            connect: authorsInput
              .filter((author) => author.id)
              .map((author) => ({ id: author.id }))
          }

        let tags: Prisma.BookCreateInput['tags']
        if (bookAttrs.tags?.length)
          tags = {
            connectOrCreate: bookAttrs.tags.map((tag) => ({
              where: { name: tag },
              create: {
                name: tag,
                slug: slugify(tag),
                group: { connect: { slug: 'cuisine' } }
              }
            }))
          }

        let contributions: Prisma.BookCreateInput['contributions']
        if (contributors.length)
          contributions = {
            create: contributors.map((contributor) => ({
              profile: contributor.id
                ? { connect: { id: contributor.id } }
                : {
                    create: {
                      name: contributor.name,
                      slug: slugify(contributor.name)
                    }
                  },
              job: { connect: { name: contributor.job } }
            }))
          }

        return {
          id,
          data: {
            ...bookAttrs,
            releaseDate: parseDate(bookAttrs.releaseDate),
            tags,
            publisher,
            contributions,
            authors,
            submitter: { connect: { id: user.id } },
            source: 'import',
            status: 'inReview'
          }
        }
      }
    )

    const result = await asyncBatch(rows, 5, async ({ id, data }) => {
      try {
        await prisma.book.create({ data })
        await inngest.send({ name: 'book.updated', data: { id } })
        return id
      } catch (e) {
        console.error(e)
        return undefined
      }
    })

    return result
  }
)

function parseDate(input?: string) {
  if (!input) return undefined
  const parsed = parse(input, 'dd/MM/yyyy', new Date()) // 19/10/2018
  if (isNaN(parsed.getTime()))
    throw new AppError('InvalidInput', 'Release date not valid')

  parsed.setHours(0, 0, 0, 0)
  return parsed
}

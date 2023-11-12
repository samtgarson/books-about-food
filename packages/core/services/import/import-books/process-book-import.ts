import { Service } from 'core/services/base'
import { asyncBatch } from 'core/services/utils/batch'
import { AppError } from 'core/services/utils/errors'
import prisma, { Prisma } from 'database'
import { parse } from 'date-fns'
import { slugify } from 'shared/utils/slugify'
import z from 'zod'

export type ProcessBookImportInput = z.input<typeof processBookImport.input>

export const processBookImport = new Service(
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
          tags: z.array(z.string()),
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
  async ({ books } = {}, user) => {
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
            connectOrCreate: authorsInput.map((author) => ({
              where: { id: author.id },
              create: { name: author.name, slug: slugify(author.name) }
            }))
          }

        let tags: Prisma.BookCreateInput['tags']
        if (bookAttrs.tags.length)
          tags = {
            connectOrCreate: bookAttrs.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }

        let contributions: Prisma.BookCreateInput['contributions']
        if (contributors.length)
          contributions = {
            create: contributors.map((contributor) => ({
              profile: {
                connectOrCreate: {
                  where: { id: contributor.id },
                  create: {
                    name: contributor.name,
                    slug: slugify(contributor.name)
                  }
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
            source: 'import'
          }
        }
      }
    )

    const result = await asyncBatch(rows, 5, async ({ id, data }) => {
      try {
        await prisma.book.create({ data })
        return id
      } catch (e) {
        console.log(`Import error: ${data.slug}`, e)
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
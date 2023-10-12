import prisma, { Prisma } from 'database'
import { parse } from 'date-fns'
import { slugify } from 'shared/utils/slugify'
import { asyncBatch } from 'src/services/utils/batch'
import { AppError } from 'src/services/utils/errors'
import { Service } from 'src/utils/service'
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
            name: z.string()
          })
        ),
        contributors: z.array(
          z.object({
            job: z.string(),
            name: z.string()
          })
        )
      })
    )
  }),
  async ({ books } = {}, user) => {
    if (user?.role !== 'admin') {
      throw new AppError('Forbidden', 'You must be an admin to import books')
    }

    const rows: Prisma.BookCreateInput[] = books.map(
      ({ bookAttrs, authors: authorsInput, contributors }) => {
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

        const authors: Prisma.BookCreateInput['authors'] = {
          connectOrCreate: authorsInput.map((author) => ({
            where: { slug: slugify(author.name) },
            create: { name: author.name, slug: slugify(author.name) }
          }))
        }

        const tags: Prisma.BookCreateInput['tags'] = {
          connectOrCreate: bookAttrs.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }

        const contributions: Prisma.BookCreateInput['contributions'] = {
          create: contributors.map((contributor) => ({
            profile: {
              connectOrCreate: {
                where: { slug: slugify(contributor.name) },
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
          ...bookAttrs,
          releaseDate: parseDate(bookAttrs.releaseDate),
          tags,
          publisher,
          contributions,
          authors,
          submitterId: user.id,
          source: 'import'
        }
      }
    )

    const result = await prisma.$transaction((tx) =>
      asyncBatch(rows, 5, (data) => tx.book.create({ data }))
    )

    return result.length
  }
)

function parseDate(input?: string) {
  if (!input) return undefined
  const parsed = parse(input, 'dd/MM/yyyy', new Date()) // 19/10/2018
  if (isNaN(parsed.getTime()))
    throw new AppError('InvalidInput', 'Release date not valid')
  return parsed
}

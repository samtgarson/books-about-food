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
  async ({ books }, { user, payload }) => {
    if (user?.role !== 'admin') {
      throw new AppError('Forbidden', 'You must be an admin to import books')
    }

    const result = await asyncBatch(books, 5, async (book) => {
      try {
        const { id, bookAttrs, authors: authorsInput, contributors } = book

        // Handle publisher - find or create
        let publisherId: string | undefined
        if (bookAttrs.publisher) {
          const { docs } = await payload.find({
            collection: 'publishers',
            where: { name: { equals: bookAttrs.publisher } },
            limit: 1,
            depth: 0
          })
          if (docs[0]) {
            publisherId = docs[0].id
          } else {
            const newPublisher = await payload.create({
              collection: 'publishers',
              data: {
                name: bookAttrs.publisher,
                slug: slugify(bookAttrs.publisher)
              },
              depth: 0
            })
            publisherId = newPublisher.id
          }
        }

        // Handle authors - create new profiles and collect IDs
        const authorIds: string[] = []
        for (const author of authorsInput) {
          if (author.id) {
            authorIds.push(author.id)
          } else {
            const newProfile = await payload.create({
              collection: 'profiles',
              data: {
                name: author.name,
                slug: slugify(author.name)
              },
              depth: 0
            })
            authorIds.push(newProfile.id)
          }
        }

        // Handle tags - find or create
        const tagIds: string[] = []
        for (const tagName of bookAttrs.tags || []) {
          const { docs } = await payload.find({
            collection: 'tags',
            where: { name: { equals: tagName } },
            limit: 1,
            depth: 0
          })
          if (docs[0]) {
            tagIds.push(docs[0].id)
          } else {
            // Find cuisine group
            const { docs: groupDocs } = await payload.find({
              collection: 'tag-groups',
              where: { slug: { equals: 'cuisine' } },
              limit: 1,
              depth: 0
            })
            const newTag = await payload.create({
              collection: 'tags',
              data: {
                name: tagName,
                slug: slugify(tagName),
                group: groupDocs[0]?.id
              },
              depth: 0
            })
            tagIds.push(newTag.id)
          }
        }

        // Handle contributions - find/create profiles and jobs
        const contributionsData: Array<{
          profile: string
          job: string
        }> = []
        for (const contributor of contributors) {
          let profileId: string
          if (contributor.id) {
            profileId = contributor.id
          } else {
            const newProfile = await payload.create({
              collection: 'profiles',
              data: {
                name: contributor.name,
                slug: slugify(contributor.name)
              },
              depth: 0
            })
            profileId = newProfile.id
          }

          // Find job by name
          const { docs: jobDocs } = await payload.find({
            collection: 'jobs',
            where: { name: { equals: contributor.job } },
            limit: 1,
            depth: 0
          })
          if (jobDocs[0]) {
            contributionsData.push({
              profile: profileId,
              job: jobDocs[0].id
            })
          }
        }

        // Create the book with all relationships
        const newBook = await payload.create({
          collection: 'books',
          data: {
            title: bookAttrs.title,
            slug: bookAttrs.slug,
            subtitle: bookAttrs.subtitle,
            releaseDate: parseDate(bookAttrs.releaseDate)?.toISOString(),
            pages: bookAttrs.pages,
            publisher: publisherId,
            authors: authorIds,
            tags: tagIds,
            contributions: contributionsData,
            submitter: user.id,
            source: 'import',
            status: 'inReview'
          },
          depth: 0
        })

        await inngest.send({ name: 'book.updated', data: { id: newBook.id } })
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

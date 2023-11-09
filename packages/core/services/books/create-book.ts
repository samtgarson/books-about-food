import { Service } from 'core/services/base'
import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { z } from 'zod'
import { AppError } from '../utils/errors'
import { createCoverFromUrl } from '../utils/resources'
import { fetchLibraryBook } from './library/fetch-library-book'
import { updateBook } from './update-book'

export type CreateBookInput = z.infer<typeof createBook.input>

export const createBook = new Service(
  z.object({
    title: z.string(),
    googleBooksId: z.string().optional(),
    subtitle: z.string().optional(),
    authorIds: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional()
  }),
  async ({ tags, authorIds, ...data } = {}, user) => {
    if (!user) throw new Error('User is required')

    const { googleBooksId } = data
    let coverImageId: string | undefined

    if (googleBooksId) {
      if (await prisma.book.count({ where: { googleBooksId } }))
        throw new AppError(
          'UniqueConstraintViolation',
          'Book already exists',
          'title'
        )

      const { data: libraryBook } = await fetchLibraryBook.call({
        id: googleBooksId
      })
      if (!libraryBook) throw new Error('Book not found')

      const { authors: authorNames, cover: coverUrl, ...attrs } = libraryBook
      data = { ...attrs, ...data }

      if (!authorIds?.length) {
        const ids = await Promise.all(
          authorNames.map(async (name) => findOrCreateAuthor(name))
        )
        authorIds = ids.filter((id): id is string => !!id)
      }

      coverImageId = await createCoverFromUrl(coverUrl)
    }

    const book = await prisma.book.create({
      data: {
        ...data,
        id: undefined,
        source: 'submitted',
        slug: slugify(data.title),
        submitterId: user.id
      }
    })

    const update = await updateBook.call(
      {
        slug: book.slug,
        authorIds,
        tags,
        coverImageId
      },
      user
    )

    if (update.success) return update.data
    throw AppError.fromJSON(update.errors[0])
  }
)

async function findOrCreateAuthor(name?: string) {
  if (!name) return undefined
  const found = await prisma.profile.findMany({ where: { name } })
  if (found.length > 1) return undefined
  if (found.length) return found[0].id

  const created = await prisma.profile.create({
    data: { name, slug: slugify(name) }
  })
  return created.id
}

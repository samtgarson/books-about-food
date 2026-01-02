import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { AuthedService, AuthedServiceContext } from 'src/core/services/base'
import { z } from 'zod'
import { createImages } from '../images/create-images'
import { findOrCreateProfile } from '../profiles/find-or-create-profile'
import { AppError } from '../utils/errors'
import { fetchLibraryBook } from './library/fetch-library-book'
import { updateBook } from './update-book'

export type CreateBookInput = z.infer<typeof createBook.input>

export const createBook = new AuthedService(
  z.object({
    title: z.string().trim(),
    googleBooksId: z.string().optional(),
    subtitle: z.string().optional(),
    authorIds: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional()
  }),
  async ({ tags, authorIds, ...data }, ctx) => {
    const { user } = ctx
    const { googleBooksId } = data
    let coverUrl: string | undefined

    if (googleBooksId) {
      if (await prisma.book.count({ where: { googleBooksId } }))
        throw new AppError(
          'UniqueConstraintViolation',
          'Book already exists',
          'title'
        )

      const { data: libraryBook } = await fetchLibraryBook.call(
        {
          id: googleBooksId
        },
        ctx
      )
      if (!libraryBook) throw new Error('Book not found')

      const { authors: authorNames, cover, ...attrs } = libraryBook
      coverUrl = cover
      data = { ...attrs, ...data }

      if (!authorIds?.length && authorNames.length) {
        const ids = await Promise.all(
          authorNames.map(async (name) => findOrCreateAuthor(name, ctx))
        )
        authorIds = ids.filter((id): id is string => !!id)
      }
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

    let coverImageId: string | undefined = undefined
    if (coverUrl) {
      const imageRes = await createImages.call(
        {
          prefix: `books/${book.id}/cover`,
          files: [{ url: coverUrl }]
        },
        ctx
      )
      if (imageRes.success) coverImageId = imageRes.data[0].id
    }

    const update = await updateBook.call(
      {
        slug: book.slug,
        authorIds,
        tags,
        coverImageId
      },
      ctx
    )

    if (update.success) return update.data
    throw AppError.fromJSON(update.errors[0])
  }
)

async function findOrCreateAuthor(
  name: string | undefined,
  ctx: AuthedServiceContext
) {
  if (!name) return undefined
  const { data } = await findOrCreateProfile.call({ name }, ctx)
  return data?.id
}

import { AuthedService } from '@books-about-food/core/services/base'
import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { z } from 'zod'
import { User } from '../../types'
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
  async ({ tags, authorIds, ...data } = {}, user) => {
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
        user
      )
      if (!libraryBook) throw new Error('Book not found')

      const { authors: authorNames, cover, ...attrs } = libraryBook
      coverUrl = cover
      data = { ...attrs, ...data }

      if (!authorIds?.length && authorNames.length) {
        const ids = await Promise.all(
          authorNames.map(async (name) => findOrCreateAuthor(name, user))
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
      const imageRes = await createImages.call({
        prefix: `books/${book.id}/cover`,
        files: [{ url: coverUrl }]
      })
      if (imageRes.success) coverImageId = imageRes.data[0].id
    }

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

async function findOrCreateAuthor(name: string | undefined, user: User) {
  if (!name) return undefined
  const { data } = await findOrCreateProfile.call({ name }, user)
  return data?.id
}

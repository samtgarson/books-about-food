import { slugify } from '@books-about-food/shared/utils/slugify'
import { RequiredDataFromCollectionSlug } from 'payload'
import { can } from 'src/core/policies'
import { AuthedService } from 'src/core/services/base'
import { Book } from 'src/payload/payload-types'
import { enum_books_source } from 'src/payload/schema'
import { withoutUndefined } from 'src/utils/object-helpers'
import { z } from 'zod'
import { inngest } from '../../jobs'
import { FullBook } from '../../models/full-book'
import { AppError } from '../utils/errors'
import { array, processString } from '../utils/inputs'
import { FULL_BOOK_DEPTH } from '../utils/payload-depth'
import { fetchBook } from './fetch-book'

export type UpdateBookInput = z.infer<typeof updateBookInput>

const updateBookInput = z
  .union([
    z.object({ slug: z.string(), title: z.string().optional() }),
    z.object({ slug: z.undefined().optional(), title: z.string() })
  ])
  .and(
    z.object({
      subtitle: z.string().optional(),
      googleBooksId: z.string().optional(),
      authorIds: array(z.string()).optional(),
      coverImageId: z.string().optional(),
      previewImageIds: array(z.string()).optional(),
      publisherId: z.string().optional(),
      releaseDate: processString(z.coerce.date()).optional(),
      pages: z.coerce.number().optional(),
      tags: array(z.string()).optional(),
      source: z
        .enum(enum_books_source.enumValues)
        .optional()
        .default('submitted'),
      id: z.string().optional()
    })
  )

export const updateBook = new AuthedService(
  updateBookInput,
  async (input, { payload, user }) => {
    const {
      authorIds: authors,
      coverImageId: coverImage,
      previewImageIds,
      tags,
      publisherId: publisher,
      releaseDate,
      ...attrs
    } = input

    // Build update data object
    const updateData: Partial<RequiredDataFromCollectionSlug<'books'>> =
      withoutUndefined({
        ...attrs,
        title: input.title,
        slug: input.slug === undefined ? slugify(input.title) : input.slug,
        releaseDate: releaseDate?.toISOString(),
        coverImage,
        publisher,
        authors,
        tags,
        previewImages: previewImageIds?.map((imageId, i) => ({
          image: imageId,
          _order: i
        }))
      })

    let result: Book
    // Check permissions if updating existing book
    if (input.slug !== undefined) {
      const { data: book } = await fetchBook.call(
        { slug: input.slug },
        { payload }
      )

      if (!book) throw new AppError('NotFound', 'Book not found')
      if (!can(user, book).update) {
        throw new Error('You do not have permission to edit this book')
      }

      result = await payload.update({
        collection: 'books',
        id: book.id,
        data: updateData,
        depth: FULL_BOOK_DEPTH,
        user
      })
    } else {
      // Create new book
      result = await payload.create({
        collection: 'books',
        data: {
          ...updateData,
          slug: slugify(input.title),
          title: input.title,
          submitter: user.id
        },
        depth: FULL_BOOK_DEPTH,
        user
      })
    }

    await inngest.send({
      name: 'book.updated',
      user,
      data: { id: result.id, coverImageChanged: !!coverImage }
    })

    return new FullBook(result)
  }
)

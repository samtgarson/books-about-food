import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'
import { array } from '../utils/inputs'
import { fetchBook } from './fetch-book'

export type UpdateBookInput = z.infer<typeof updateBookInput>

const updateBookInput = z.object({
  slug: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  authorIds: array(z.string()).optional(),
  coverImageId: z.string().optional(),
  previewImageIds: array(z.string()).optional(),
  publisherId: z.string().optional(),
  releaseDate: z.coerce.date().optional(),
  pages: z.coerce
    .number()
    .optional()
    .transform((n) => (n ? n : null)),
  tags: array(z.string()).optional()
})

export const updateBook = new Service(
  updateBookInput,
  async ({ slug, ...data } = {}, user) => {
    if (!user) throw new Error('User is required')

    const { data: book } = await fetchBook.call({ slug }, user)
    if (book?.submitterId !== user.id && user.role !== 'admin') {
      throw new Error('You do not have permission to edit this book')
    }

    const {
      title,
      authorIds,
      coverImageId,
      previewImageIds = [],
      publisherId,
      tags,
      ...attrs
    } = data

    const result = await prisma.book.update({
      where: { slug },
      data: {
        ...attrs,
        title,
        slug: title ? slugify(title) : undefined,
        authors: authorIds
          ? { set: authorIds.map((id) => ({ id })) }
          : undefined,
        coverImage: data.coverImageId?.length
          ? coverImageId
            ? { connect: { id: coverImageId } }
            : { delete: true }
          : undefined,
        previewImages:
          'previewImageIds' in data
            ? { set: previewImageIds?.map((id) => ({ id })) }
            : undefined,
        publisher: publisherId ? { connect: { id: publisherId } } : undefined,
        tags: tags ? { set: tags.map((name) => ({ name })) } : undefined
      },
      include: bookIncludes
    })

    return new Book(result)
  }
)

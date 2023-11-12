import { inngest } from 'core/gateways/inngest'
import { Book } from 'core/models/book'
import { BookAttrs } from 'core/models/types'
import { Service } from 'core/services/base'
import prisma, { Prisma } from 'database'
import { slugify } from 'shared/utils/slugify'
import { z } from 'zod'
import { bookIncludes } from '../utils'
import { AppError } from '../utils/errors'
import { array, processString } from '../utils/inputs'
import { fetchBook } from './fetch-book'

export type UpdateBookInput = z.infer<typeof updateBookInput>

const attrsInput = {
  subtitle: z.string().optional(),
  googleBooksId: z.string().optional(),
  authorIds: array(z.string()).optional(),
  coverImageId: z.string().optional(),
  previewImageIds: array(z.string()).optional(),
  publisherId: z.string().optional(),
  releaseDate: processString(z.coerce.date().optional()),
  pages: z.coerce.number().optional(),
  tags: array(z.string()).optional()
}

const updateBookInput = z
  .object({
    slug: z.string(),
    title: z.string().optional(),
    ...attrsInput
  })
  .or(
    z.object({
      title: z.string(),
      slug: z.never().optional(),
      ...attrsInput
    })
  )

export const updateBook = new Service(updateBookInput, async (input, user) => {
  if (!input) throw new Error('Input is required')
  if (!user) throw new Error('User is required')
  const { slug, ...data } = input

  if (slug) {
    const { data: book } = await fetchBook.call({ slug }, user)
    if (book && book.submitterId !== user.id && user.role !== 'admin') {
      throw new Error('You do not have permission to edit this book')
    }
  }

  const { title, authorIds, coverImageId, publisherId, ...attrs } = data

  const properties = {
    ...attrs,
    title,
    slug: title ? slugify(title) : undefined,
    coverImage: coverImageId ? { connect: { id: coverImageId } } : undefined,
    publisher: publisherId ? { connect: { id: publisherId } } : undefined,
    tags: undefined,
    authors: undefined,
    previewImages: undefined
  } satisfies Prisma.BookUpdateInput

  const previewImageIds = data.previewImageIds?.map((id) => ({ id }))
  const tags = data.tags?.map((name) => ({ name }))
  const authors = authorIds?.map((id) => ({ id }))

  let result: BookAttrs | undefined = undefined
  if (slug) {
    result = await prisma.book.update({
      where: { slug },
      data: {
        ...properties,
        previewImages: { set: previewImageIds },
        tags: { set: tags },
        authors: { set: authors }
      },
      include: bookIncludes
    })
  } else if (title) {
    result = await prisma.book.create({
      data: {
        ...properties,
        title,
        slug: slugify(title),
        previewImages: { connect: previewImageIds },
        tags: { connect: tags },
        submitter: { connect: { id: user.id } },
        authors: { connect: authors }
      },
      include: bookIncludes
    })
  }
  if (!result) throw new AppError('InvalidInput', 'Title or slug is required')

  await inngest.send({
    name: 'book.updated',
    user,
    data: { id: result.id, coverImageChanged: !!coverImageId }
  })

  return new Book(result)
})
import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Book } from 'src/models/book'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { bookIncludes } from '../utils'
import { array } from '../utils/inputs'
import { fetchBook } from './fetch-book'

export const updateBook = new Service(
  z.object({
    slug: z.string(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    authorNames: array(z.string()).optional(),
    coverImageId: z.string().optional(),
    previewImageIds: array(z.string()).optional(),
    publisherId: z.string().optional(),
    releaseDate: z.coerce.date().optional(),
    pages: z.coerce
      .number()
      .optional()
      .transform((n) => (n ? n : null)),
    tags: array(z.string()).optional()
  }),
  async ({ slug, ...data } = {}, user) => {
    if (!user) throw new Error('User is required')

    // TODO Move this to where clause in Prisma 5
    const book = await fetchBook.call({ slug }, user)
    if (book.submitterId !== user.id && user.role !== 'admin') {
      throw new Error('You do not have permission to edit this book')
    }

    const {
      title,
      authorNames,
      coverImageId,
      previewImageIds = [],
      publisherId,
      tags,
      ...attrs
    } = data

    const authors = await getAuthors(authorNames)
    const result = await prisma.book.update({
      where: { slug },
      data: {
        ...attrs,
        title,
        slug: title ? slugify(title) : undefined,
        authors: authors
          ? { set: authors.map(({ id }) => ({ id })) }
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

const getAuthors = async (authorNames?: string[]) => {
  if (!authorNames) return
  return Promise.all(
    authorNames.map((name) =>
      prisma.profile.upsert({
        where: { name },
        create: { name, slug: slugify(name) },
        update: {}
      })
    )
  )
}

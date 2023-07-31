import prisma from 'database'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { fetchBook } from './fetch-book'
import { slugify } from 'shared/utils/slugify'
import { array } from '../utils/inputs'
import { bookIncludes } from '../utils'
import { Book } from 'src/models/book'

export const updateBook = new Service(
  z.object({
    slug: z.string(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    authorNames: array(z.string()).optional(),
    coverImageId: z.string().optional(),
    previewImageIds: array(z.string()).optional()
  }),
  async ({ slug, ...data } = {}, user) => {
    if (!slug) throw new Error('Slug is required')
    if (!user) throw new Error('User is required')

    // TODO Move this to where clause in Prisma 5
    const book = await fetchBook.call({ slug }, user)
    if (book.submitterId !== user.id) {
      throw new Error('You do not have permission to edit this book')
    }

    const { authorNames, coverImageId, previewImageIds = [], ...attrs } = data

    const authors = await getAuthors(authorNames)
    const result = await prisma.book.update({
      where: { slug },
      data: {
        ...attrs,
        slug: data.title ? slugify(data.title) : undefined,
        authors: authors
          ? { set: authors.map(({ id }) => ({ id })) }
          : undefined,
        coverImage:
          'coverImageId' in data
            ? coverImageId
              ? { connect: { id: coverImageId } }
              : { delete: true }
            : undefined,
        previewImages:
          'previewImageIds' in data
            ? { set: previewImageIds?.map((id) => ({ id })) }
            : undefined
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
        update: { name }
      })
    )
  )
}

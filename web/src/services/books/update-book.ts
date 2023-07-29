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
    authorNames: array(z.string()).optional()
  }),
  async ({ slug, authorNames = [], ...data } = {}, user) => {
    if (!slug) throw new Error('Slug is required')
    if (!user) throw new Error('User is required')

    // TODO Move this to where clause in Prisma 5
    const book = await fetchBook.call({ slug }, user)
    if (book.submitterId !== user.id) {
      throw new Error('You do not have permission to edit this book')
    }

    const authors = await Promise.all(
      authorNames.map((name) =>
        prisma.profile.upsert({
          where: { name },
          create: { name, slug: slugify(name) },
          update: { name }
        })
      )
    )

    const result = await prisma.book.update({
      where: { slug },
      data: {
        ...data,
        slug: data.title ? slugify(data.title) : undefined,
        authors: { set: authors.map(({ id }) => ({ id })) }
      },
      include: bookIncludes
    })

    return new Book(result)
  }
)

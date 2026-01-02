import { AuthedService } from 'src/core/services/base'
import { z } from 'zod'

export const updateLinks = new AuthedService(
  z.object({
    slug: z.string(),
    links: z
      .object({
        site: z.string(),
        url: z.string()
      })
      .array()
  }),
  async ({ slug, links }, { payload, user }) => {
    const { docs } = await payload.find({
      collection: 'books',
      where: { slug: { equals: slug } },
      limit: 1,
      user
    })

    if (!docs[0]) throw new Error('Book not found')

    const book = docs[0]

    // Delete all existing links and create new ones in parallel
    await Promise.all([
      // Delete existing links using bulk delete
      payload.delete({
        collection: 'book-links',
        where: { book: { equals: book.id } },
        user
      }),
      // Create new links
      ...links.map((link) =>
        payload.create({
          collection: 'book-links',
          data: {
            book: book.id,
            site: link.site,
            url: link.url
          },
          user
        })
      )
    ])
  }
)

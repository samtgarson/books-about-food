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

    // Delete existing links
    const { docs: existingLinks } = await payload.find({
      collection: 'book-links',
      where: { book: { equals: book.id } },
      user
    })

    await Promise.all(
      existingLinks.map((link) =>
        payload.delete({
          collection: 'book-links',
          id: link.id,
          user
        })
      )
    )

    // Create new links
    await Promise.all(
      links.map((link) =>
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
    )
  }
)

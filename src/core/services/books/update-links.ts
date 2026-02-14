import { BookLinkSite } from 'src/core/models/types'
import { can } from 'src/core/policies'
import { AuthedService } from 'src/core/services/base'
import { enum_books_links_site } from 'src/payload/schema'
import { z } from 'zod'
import { AppError } from '../utils/errors'
import { fetchBook } from './fetch-book'

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
    const { data: book } = await fetchBook.call({ slug }, { payload })

    if (!book) throw new AppError('NotFound', 'Book not found')
    if (!can(user, book).update)
      throw new AppError('Forbidden', 'You cannot update this book')

    payload.update({
      collection: 'books',
      where: { id: { equals: book.id } },
      data: {
        links: links.map(function (link) {
          const site = isKnownSite(link.site) ? link.site : 'Other'
          const siteOther = site === 'Other' ? link.site : undefined
          return {
            site,
            'site (other)': siteOther,
            url: link.url
          }
        })
      }
    })
  }
)

function isKnownSite(site: string): site is BookLinkSite {
  return enum_books_links_site.enumValues.includes(site as BookLinkSite)
}

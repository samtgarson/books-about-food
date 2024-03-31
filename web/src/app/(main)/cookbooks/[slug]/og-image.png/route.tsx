import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import Color from 'color'
import { NextRequest } from 'next/server'
import comingSoon from 'src/assets/images/cover-coming-soon.png'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

export const revalidate = 60 * 60 // 1 hour

const bookShadow = `
      0px 2.5px 1.9px rgba(0, 0, 0, 0.02),
      0px 6px 4.7px rgba(0, 0, 0, 0.028),
      0px 11.3px 8.8px rgba(0, 0, 0, 0.035),
      0px 20.1px 15.6px rgba(0, 0, 0, 0.042),
      0px 37.6px 29.2px rgba(0, 0, 0, 0.05),
      0px 90px 70px rgba(0, 0, 0, 0.07)`

export async function GET(
  _request: NextRequest,
  {
    params: { slug }
  }: {
    params: { slug: string }
  }
) {
  const { data: book } = await call(fetchBook, {
    slug,
    onlyPublished: true
  })
  if (!book) return new Response('Not Found', { status: 404 })
  const { cover } = book

  const backgroundColor = book.backgroundColor
    ? new Color(book.backgroundColor).hex()
    : '#F0EEEB'

  return OGTemplate.response(
    <OGTemplate.Root backgroundColor={backgroundColor}>
      <OGTemplate.Half>
        <OGTemplate.Title>{book.title}</OGTemplate.Title>
        {book.authorNames && (
          <OGTemplate.Description>{book.authorNames}</OGTemplate.Description>
        )}
      </OGTemplate.Half>
      <OGTemplate.Half right centered>
        {cover ? (
          <img
            src={cover.src}
            width={cover.widthFor(430)}
            height={430}
            style={{ boxShadow: bookShadow }}
          />
        ) : (
          <img
            src={appUrl(comingSoon.src)}
            height={430}
            width={comingSoon.width * (430 / comingSoon.height)}
            style={{ boxShadow: bookShadow }}
          />
        )}
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}

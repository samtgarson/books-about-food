import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { appUrl } from '@books-about-food/core/utils/app-url'
import Color from 'color'
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import comingSoon from 'src/assets/images/cover-coming-soon.png'
import { loadFonts } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

const dims = {
  width: 1200,
  height: 630,
  margin: 136,
  gap: 95,
  title: 505
}

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
  const fonts = await loadFonts()

  const backgroundColor = book.backgroundColor
    ? new Color(book.backgroundColor).hex()
    : '#F0EEEB'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: dims.width,
          height: dims.height,
          backgroundColor,
          position: 'relative',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 136,
          paddingRight: 136,
          fontFamily: '"Graphik"'
        }}
      >
        {cover ? (
          <img
            src={cover.src}
            width={cover.widthFor(420)}
            height={420}
            style={{ boxShadow: bookShadow }}
          />
        ) : (
          <img
            src={`${appUrl()}${comingSoon.src}`}
            height={420}
            width={comingSoon.width * (420 / comingSoon.height)}
            style={{ boxShadow: bookShadow }}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: dims.gap,
            flexGrow: 1,
            flexShrink: 1,
            color: book.foregroundColor || '#000'
          }}
        >
          <p
            style={{
              fontSize: 64,
              lineHeight: 1.2
            }}
          >
            {book.title}
          </p>
          {book.authorNames && (
            <p
              style={{
                fontSize: 32,
                opacity: 0.6
              }}
            >
              {book.authorNames}
            </p>
          )}
        </div>
      </div>
    ),
    {
      width: dims.width,
      height: dims.height,
      fonts
    }
  )
}

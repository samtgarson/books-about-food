import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { fetchPublisher } from '@books-about-food/core/services/publishers/fetch-publisher'
import { NextRequest } from 'next/server'
import { CSSProperties } from 'react'
import { OGTemplate } from 'src/utils/image-response-helpers'
import { call } from 'src/utils/service'

const coverSize = { width: 280, height: 360 }
const coverGap = { x: 64, y: 48 }

const coverRows: CSSProperties[] = [
  {
    top: '50%',
    transform: 'translateY(-50%)'
  },
  {
    top: '50%',
    transform: `translateY(${coverSize.height / 2 + coverGap.y}px)`
  },
  {
    bottom: '50%',
    transform: `translateY(-${coverSize.height / 2 + coverGap.y}px)`
  }
]

export const revalidate = 3600

export async function GET(
  _request: NextRequest,
  props: RouteContext<'/publishers/[slug]/og-image.png'>
) {
  const { slug } = await props.params

  const [{ data: publisher }, { data: { books } = { books: [] } }] =
    await Promise.all([
      call(fetchPublisher, { slug }),
      call(fetchBooks, { publisherSlug: slug, perPage: 6 })
    ])
  if (!publisher) return new Response('Not Found', { status: 404 })

  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title>{publisher.name}</OGTemplate.Title>
      </OGTemplate.Half>
      <OGTemplate.Half right expanded style={{ width: 500 }}>
        {coverRows.map((style, i) => (
          <div
            key={`row-${i}`}
            style={{
              ...style,
              display: 'flex',
              gap: 64,
              left: 0,
              position: 'absolute'
            }}
          >
            {[0, 1].map((j) => {
              const key = `cover-${i}-${j}`
              const cover = books[i * 2 + j]?.cover
              if (!cover)
                return (
                  <div
                    key={key}
                    style={{
                      width: coverSize.width,
                      height: coverSize.height,
                      backgroundColor: '#D8D6D3'
                    }}
                  />
                )
              return (
                <img
                  key={key}
                  src={cover.src}
                  width={cover.widthFor(coverSize.height)}
                  height={coverSize.height}
                />
              )
            })}
          </div>
        ))}
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}

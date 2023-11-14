import { fetchBook } from '@books-about-food/core/services/books/fetch-book'
import { readFile } from 'fs/promises'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/server'
import { call } from 'src/utils/service'
import { CookbooksPageProps } from './page'

export const runtime = 'edge'

export async function generateImageMetadata({
  params: { slug }
}: CookbooksPageProps) {
  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()

  return [
    {
      id: 'cover',
      size: { width: 1200, height: 600 },
      alt: `${book.title} by ${book.authors
        .map((a) => a.name)
        .join(', ')} on Books About Food`,
      contentType: 'image/png'
    }
  ]
}

export default async function Image({
  params: { slug }
}: CookbooksPageProps & {
  id: string
}) {
  const { data: book } = await call(fetchBook, { slug })
  if (!book) notFound()
  // get font in array buffer
  const font = await readFile(
    require.resolve('src/assets/fonts/Graphik-Medium-Trial.otf')
  )
  console.log(font)

  return new ImageResponse(
    (
      <div
        style={{
          padding: 30,
          width: 1200,
          height: 600,
          display: 'flex',
          gap: 40,
          fontFamily: 'graphik'
        }}
      >
        {book.cover && (
          <img
            src={book.cover.src}
            style={{
              height: 560,
              width: book.cover.widthFor(560),
              boxShadow:
                '0 2.5px 1.9px rgba(0,0,0,.02), 0 6px 4.7px rgba(0,0,0,.028), 0 11.3px 8.8px rgba(0,0,0,.035), 0 20.1px 15.6px rgba(0,0,0,.042), 0 37.6px 29.2px rgba(0,0,0,.05), 0 90px 70px rgba(0,0,0,.07)'
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flex: '1 1 100%'
          }}
        >
          <p style={{ fontSize: 48 }}>{book.title}</p>
          <p style={{ fontSize: 28 }}>{book.subtitle}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'graphik',
          data: font,
          style: 'normal'
        }
      ]
    }
  )
}

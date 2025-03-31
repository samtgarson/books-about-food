import { Image } from '@books-about-food/core/models/image'
import { bookIncludes } from '@books-about-food/core/services/utils'
import prisma from '@books-about-food/database'
import { getColors } from '@books-about-food/jobs/lib/generate-palette/get-colors'
import { toColorString } from '@books-about-food/shared/utils/types'
import Img from 'next/image'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { Loader } from 'src/components/atoms/loader'
import { PageProps } from 'src/components/types'

type Hsl = { h: number; s: number; l: number; label?: string }

export default async function ColorTest(props: PageProps) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page ?? 0)
  const books = await prisma.book.findMany({
    skip: page * 15,
    take: 15,
    orderBy: {
      title: 'asc'
    },
    include: bookIncludes,
    where: { coverImage: { isNot: null } }
  })
  return (
    <Container belowNav>
      <h1>Color Test</h1>
      <table>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="p-3">
                {book.coverImage && (
                  <Img {...new Image(book.coverImage, '').imageAttrs(150)} />
                )}
              </td>
              <td className="p-3">
                Color Thief (old)
                {book.palette && (
                  <Palette
                    palette={[
                      book.backgroundColor as Hsl,
                      ...(book.palette as Hsl[])
                    ]}
                  />
                )}
              </td>
              <td className="p-3">
                Vibrant (new)
                <Suspense fallback={<Loader />}>
                  {book.coverImage && (
                    <VibrantPalette cover={new Image(book.coverImage, '')} />
                  )}
                </Suspense>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        {page > 0 && <a href={`/dev/colors?page=${page - 1}`}>Prev</a>}
        {books.length === 15 && (
          <a href={`/dev/colors?page=${page + 1}`}>Next</a>
        )}
      </div>
    </Container>
  )
}

function Palette({ palette }: { palette: Hsl[] }) {
  return (
    <div className="flex gap-2 rounded-full bg-white p-2">
      {palette.map((color, i) => (
        <div
          title={color.label}
          key={i}
          className="size-8 rounded-full"
          style={{
            backgroundColor: toColorString(color)
          }}
        />
      ))}
    </div>
  )
}

async function VibrantPalette({ cover }: { cover: Image }) {
  try {
    const result = await getColors(cover.src)

    return <Palette palette={result.palette} />
  } catch (e) {
    console.error(e)
    return null
  }
}

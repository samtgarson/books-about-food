import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import Color from 'color'
import splashy from 'splashy'

export async function generateBookPalette(bookId: string) {
  const image = await prisma.image.findUnique({
    where: { coverForId: bookId }
  })

  if (!image) return true

  const src = imageUrl(image.path)
  const res = await fetch(src)
  const buffer = Buffer.from(await res.arrayBuffer())
  const hex = await splashy(buffer)
  if (hex.length < 5) return false

  const colours = hex.map(
    (hex) => '[' + new Color(hex).rgb().array().join(',') + ']'
  )
  const backgroundColor = colours[4]
  const palette = `array[${colours.join(',')}]`

  await prisma.$executeRawUnsafe(query(bookId, backgroundColor, palette))

  return true
}

function query(bookId: string, backgroundColor: string, palette: string) {
  return `UPDATE "books" SET "background_color" = array${backgroundColor}, "palette" = ${palette} WHERE "id" = '${bookId}'`
}

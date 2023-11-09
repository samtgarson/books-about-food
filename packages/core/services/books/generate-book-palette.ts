import Color from 'color'
import { Image } from 'core/models/image'
import { Service } from 'core/services/base'
import prisma from 'database'
import splashy from 'splashy'
import z from 'zod'
import { AppError } from '../utils/errors'

export const generateBookPalette = new Service(
  z.object({
    bookId: z.string()
  }),
  async ({ bookId } = {}) => {
    const image = await prisma.image.findUnique({
      where: { coverForId: bookId }
    })

    if (!image) return true

    const src = Image.src(image.path)
    const res = await fetch(src)
    const buffer = Buffer.from(await res.arrayBuffer())
    const hex = await splashy(buffer)
    if (hex.length < 5)
      throw new AppError('ServerError', 'Did not generate 5 colours')

    const colours = hex.map(
      (hex) => '[' + new Color(hex).rgb().array().join(',') + ']'
    )
    const backgroundColor = colours[4]
    const palette = `array[${colours.join(',')}]`

    await prisma.$executeRawUnsafe(query(bookId, backgroundColor, palette))

    return true
  }
)

function query(bookId: string, backgroundColor: string, palette: string) {
  return `UPDATE "books" SET "background_color" = array${backgroundColor}, "palette" = ${palette} WHERE "id" = '${bookId}'`
}

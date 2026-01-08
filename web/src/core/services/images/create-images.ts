import { extension } from 'mime-types'
import { File } from 'payload'
import { Service } from 'src/core/services/base'
import { z } from 'zod'

export type CreateImageInput = z.infer<typeof createImages.input>

export const createImages = new Service(
  z.object({
    prefix: z.string(),
    files: z.array(
      z
        .object({
          size: z.number(),
          name: z.string(),
          mimetype: z.string(),
          data: z.instanceof(Buffer)
        })
        .or(z.url())
    )
  }),
  async ({ files }, { payload }) => {
    const imageData = await Promise.all(
      files.map(async (input) => {
        const file =
          typeof input === 'string' ? await fileFromUrl(input) : input

        return payload.create({
          collection: 'images',
          data: {},
          file
        })
      })
    )

    return imageData
  }
)

async function fileFromUrl(url: string): Promise<File> {
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  const mimetype = res.headers.get('Content-Type') || 'image/jpeg'
  const ext = extension(mimetype)
  const filename = url.split('/').pop() || 'image'
  return {
    data: Buffer.from(arrayBuffer),
    size: arrayBuffer.byteLength,
    name: ext
      ? `${filename.split('.').slice(0, -1).join('.')}.${ext}`
      : filename,
    mimetype
  }
}

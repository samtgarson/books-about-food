import prisma from '@books-about-food/database'
import sizeOf from 'buffer-image-size'
import { contentType } from 'mime-types'
import { Service } from 'src/core/services/base'
import { FileUploader } from 'src/core/services/images/file-uploader'
import { ImageBlurrer } from 'src/core/services/images/image-blurrer'
import { z } from 'zod'

export type CreateImageInput = z.infer<typeof createImages.input>
const uploader = new FileUploader()

export const createImages = new Service(
  z.object({
    prefix: z.string(),
    files: z.array(
      z
        .object({
          buffer: z.instanceof(Buffer),
          type: z.string()
        })
        .or(z.object({ url: z.string() }))
    )
  }),
  async ({ files, prefix }, _ctx) => {
    const data = await Promise.all(
      files.map(async (file) => {
        if ('url' in file) {
          file = await fileFromUrl(file.url)
        }
        const { buffer, type } = file
        const { path, id } = await uploader.upload(buffer, type, prefix)
        const blurrer = new ImageBlurrer({ s3path: path })
        const placeholderUrl = await blurrer.call()
        const { width, height } = sizeOf(buffer)

        return { id, path, width, height, placeholderUrl }
      })
    )

    await prisma.image.createMany({ data })

    return prisma.image.findMany({
      where: { id: { in: data.map(({ id }) => id) } }
    })
  }
)

async function fileFromUrl(url: string) {
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())
  const type =
    contentType(res.headers.get('content-type') || 'image/jpeg') || 'image/jpeg'

  return { buffer, type }
}

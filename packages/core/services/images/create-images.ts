import { inngest } from '@books-about-food/core/jobs'
import { Service } from '@books-about-food/core/services/base'
import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import prisma from '@books-about-food/database'
import sizeOf from 'buffer-image-size'
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
  async ({ files, prefix } = {}) => {
    const data = await Promise.all(
      files.map(async (file) => {
        if ('url' in file) {
          file = await fileFromUrl(file.url)
        }
        const { buffer, type } = file
        const { path, id } = await uploader.upload(buffer, type, prefix)
        const { width, height } = sizeOf(buffer)

        return { id, path, width, height }
      })
    )

    await prisma.image.createMany({ data })
    const ids = data.map(({ id }) => id)

    await Promise.all(
      ids.map((id) =>
        inngest.send({
          name: 'image.created',
          data: { id }
        })
      )
    )

    return prisma.image.findMany({
      where: { id: { in: ids } }
    })
  }
)

async function fileFromUrl(url: string) {
  const res = await fetch(url)
  const buffer = Buffer.from(await res.arrayBuffer())
  const type = res.headers.get('content-type')?.split(';')?.[0] || 'image/jpeg'

  return { buffer, type }
}

import { Service } from '@books-about-food/core/services/base'
import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import { ImageBlurrer } from '@books-about-food/core/services/images/image-blurrer'
import prisma from '@books-about-food/database'
import sizeOf from 'buffer-image-size'
import { z } from 'zod'

export type CreateImageInput = z.infer<typeof createImages.input>
const uploader = new FileUploader()

export const createImages = new Service(
  z.object({
    prefix: z.string(),
    files: z.array(
      z.object({
        buffer: z.instanceof(Buffer),
        type: z.string()
      })
    )
  }),
  async ({ files, prefix } = {}) => {
    const data = await Promise.all(
      files.map(async ({ buffer, type }) => {
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

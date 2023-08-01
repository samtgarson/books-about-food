'use server'

import prisma from 'database'
import sizeOf from 'buffer-image-size'
import { FileUploader } from 'shared/services/file-uploader'
import { ImageBlurrer } from 'shared/services/image-blurrer'

const uploader = new FileUploader()

export async function uploadImage(prefix: string, formData: FormData) {
  const files = formData.getAll('image') as Blob[]

  const data = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mimeType = file.type

      const { path, id } = await uploader.upload(buffer, mimeType, prefix)
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

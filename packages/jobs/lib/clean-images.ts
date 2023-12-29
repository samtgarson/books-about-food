import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import prisma, { Prisma } from '@books-about-food/database'

const s3 = new FileUploader()

export const cleanImages = async () => {
  const where: Prisma.ImageWhereInput = {
    AND: [
      { publisherId: null },
      { coverForId: null },
      { previewForId: null },
      { profileId: null }
    ]
  }

  const images = await prisma.image.findMany({ where })
  if (!images.length) return 0

  console.info(`Deleting ${images.length} images...`)
  await Promise.all(images.map((image) => s3.delete(image.path)))
  console.info(`Deleted ${images.length} images from S3`)
  await prisma.image.deleteMany({ where })
  console.info(`Deleted ${images.length} images from database`)

  return images.length
}

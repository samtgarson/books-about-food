import sizeOf from 'buffer-image-size'
import prisma, { Prisma } from 'database'
import { FileUploader } from 'shared/services/file-uploader'
import { ImageBlurrer } from 'shared/services/image-blurrer'

const s3 = new FileUploader()

export const parseDataUri = (dataUri: string) => {
  const [header, data] = dataUri.substring(5).split(',')
  const [mimeType] = header.split(';')

  return { mimeType, buffer: Buffer.from(data, 'base64') }
}

export const uploadImage = async (
  dataUri: string,
  prefix: string,
  key: keyof Prisma.ImageCreateManyInput,
  foreignKey: string,
  replace = false
) => {
  if (!dataUri) return undefined
  if (dataUri.startsWith(prefix)) {
    const image = await prisma.image.findUnique({ where: { path: dataUri } })
    return image?.id
  }

  const { buffer, mimeType } = parseDataUri(dataUri)
  const { id, path } = await s3.upload(buffer, mimeType, prefix)
  const { width, height } = sizeOf(buffer)

  if (replace && key && foreignKey) {
    await deleteExisting(key, foreignKey)
  }

  const blurrer = new ImageBlurrer({ s3path: path })
  const placeholderUrl = await blurrer.call()

  await prisma.image.create({
    data: { id, path, [key]: foreignKey, width, height, placeholderUrl }
  })

  return id
}

export const deleteImage = async (where: Prisma.ImageWhereInput) => {
  const images = await prisma.image.findMany({ where })
  if (!images.length) return

  await Promise.all(images.map((image) => s3.delete(image.path)))
  await prisma.image.deleteMany({ where })
}

const deleteExisting = async (
  key: keyof Prisma.ImageCreateManyInput,
  foreignKey: string
) => {
  const existing = await prisma.image.findMany({
    where: { [key]: foreignKey }
  })

  if (existing) await deleteImage({ [key]: foreignKey })
}

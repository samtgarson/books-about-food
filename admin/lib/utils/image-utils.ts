import sizeOf from 'buffer-image-size'
import prisma, { Prisma } from 'database'
import { FileUploader } from 'shared/services/file-uploader'

const s3 = new FileUploader()

export const parseDataUri = (dataUri: string) => {
  const [header, data] = dataUri.substring(5).split(',')
  const [mimeType] = header.split(';')

  return { mimeType, buffer: Buffer.from(data, 'base64') }
}

export const uploadImage = async (
  dataUri: string,
  prefix: string,
  key?: keyof Prisma.ImageCreateManyInput,
  foreignKey?: string
) => {
  if (!dataUri) return undefined
  if (dataUri.startsWith(prefix)) {
    const image = await prisma.image.findUnique({ where: { url: dataUri } })
    return image?.id
  }

  const { buffer, mimeType } = parseDataUri(dataUri)
  const { id, path } = await s3.upload(buffer, mimeType, prefix)
  const { width, height } = sizeOf(buffer)

  if (key && foreignKey) {
    await replaceImage(id, key, foreignKey, path, width, height)
  }

  return id
}

export const deleteImage = async (query: Prisma.ImageWhereInput) => {
  const images = await prisma.image.findMany({ where: query })
  if (!images.length) return

  await Promise.all(images.map((image) => s3.delete(image.url)))
  await prisma.image.deleteMany({ where: query })
}

const replaceImage = async (
  id: string,
  key: keyof Prisma.ImageCreateManyInput,
  foreignKey: string,
  path: string,
  width: number,
  height: number
) => {
  const existing = await prisma.image.findUnique({
    where: { [key]: foreignKey }
  })

  if (existing) await deleteImage({ [key]: foreignKey })
  await prisma.image.create({
    data: { id, url: path, [key]: foreignKey, width, height }
  })
}

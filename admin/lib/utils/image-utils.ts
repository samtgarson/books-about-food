import { createImages } from '@books-about-food/core/services/images/create-images'
import { FileUploader } from '@books-about-food/core/services/images/file-uploader'
import prisma, { Prisma } from '@books-about-food/database'

const s3 = new FileUploader()

export const parseDataUri = (dataUri: string) => {
  const [header, data] = dataUri.substring(5).split(',')
  const [type] = header.split(';')

  return { type, buffer: Buffer.from(data, 'base64') }
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
    return image
  }

  const { buffer, type } = parseDataUri(dataUri)

  if (replace && key && foreignKey) {
    await deleteExisting(key, foreignKey)
  }

  const { data } = await createImages.call({
    prefix,
    files: [{ buffer, type }]
  })
  const image = data?.at(0)
  if (!image) return

  await prisma.image.update({
    where: { id: image?.id },
    data: { [key]: foreignKey }
  })

  return image
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

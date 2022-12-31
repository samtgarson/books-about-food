import { FileUploader } from 'shared/services/file-uploader'
const s3 = new FileUploader()

export const parseDataUri = (dataUri: string) => {
  const [header, data] = dataUri.substring(5).split(',')
  const [mimeType] = header.split(';')

  return { mimeType, buffer: Buffer.from(data, 'base64') }
}

export const uploadImage = async (dataUri: string, prefix: string) => {
  if (!dataUri) return undefined
  const { buffer, mimeType } = parseDataUri(dataUri)
  const path = await s3.upload(buffer, mimeType, prefix)
  return path
}

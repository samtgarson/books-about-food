import { getTableColumns } from '@payloadcms/db-postgres/drizzle'
import { images, profiles } from 'src/payload/schema'

export const imageColumns = {
  id: images.id,
  url: images.url,
  filename: images.filename,
  mimeType: images.mimeType,
  filesize: images.filesize,
  width: images.width,
  height: images.height,
  placeholderUrl: images.placeholderUrl,
  prefix: images.prefix,
  createdAt: images.createdAt,
  updatedAt: images.updatedAt
}

export const profileColumns = {
  ...getTableColumns(profiles),
  avatar: imageColumns
}

import { CollectionCustomizer } from '@forestadmin/agent'
import { uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

export const customiseBooks = (
  collection: CollectionCustomizer<Schema, 'books'>
) => {
  collection.replaceFieldWriting('cover_url', async (dataUri, context) => {
    if (!dataUri) return { cover_url: undefined }

    const prefix = `book-covers/${context.record.id}`
    const path = await uploadImage(dataUri, prefix)

    return { cover_url: path }
  })

  collection.replaceFieldWriting(
    'image_urls',
    async (dataUris = [], context) => {
      const paths = await Promise.all(
        dataUris.map((dataUri) => {
          const prefix = `book-images/${context.record.id}`
          return uploadImage(dataUri, prefix)
        })
      )

      return { image_urls: paths.filter((path): path is string => !!path) }
    }
  )
}

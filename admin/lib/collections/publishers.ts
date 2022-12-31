import { CollectionCustomizer } from '@forestadmin/agent'
import { uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

export const customisePublishers = (
  collection: CollectionCustomizer<Schema, 'publishers'>
) => {
  collection.replaceFieldWriting('logo_url', async (dataUri, context) => {
    if (!dataUri) return { logo_url: undefined }

    const prefix = `publisher-logos/${context.record.id}`
    const path = await uploadImage(dataUri, prefix)

    return { logo_url: path }
  })
}

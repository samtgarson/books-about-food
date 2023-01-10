import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

export const customisePublishers = (
  collection: CollectionCustomizer<Schema, 'publishers'>
) => {
  collection
    .addField('Logo', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const image = await prisma.image.findUnique({
              where: { publisherId: record.id }
            })
            return image?.url
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Logo', async (dataUri, context) => {
      if (!dataUri) {
        await deleteImage({ publisherId: context.record.id })
        return
      }

      const prefix = `publisher-logos/${context.record.id}`
      await uploadImage(dataUri, prefix, 'publisherId', context.record.id)
      return { id: context.record.id }
    })
}

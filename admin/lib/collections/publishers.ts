import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

const uploadLogo = async (dataUri: string, publisherId: string) => {
  if (!dataUri) {
    await deleteImage({ publisherId })
    return
  }

  const prefix = `publisher-logos/${publisherId}`
  await uploadImage(dataUri, prefix, 'publisherId', publisherId, true)
}

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
            return image?.path
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Logo', async (dataUri, context) => {
      if (!context.record.id) return
      await uploadLogo(dataUri, context.record.id)
    })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((publisher) => {
      publisher.slug ||= slugify(publisher.name)
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map((publisher, i) =>
        uploadLogo(context.data[i].Logo, publisher.id)
      )
    )
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map((record) => deleteImage({ publisherId: record.id }))
    )
  })
}

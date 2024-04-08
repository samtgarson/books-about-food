import prisma from '@books-about-food/database'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

const uploadLogo = async (dataUri: string, publisherId: string) => {
  if (!dataUri) {
    await deleteImage({ publisherId })
    return
  }

  const prefix = `publisher-logos/${publisherId}`
  return await uploadImage(dataUri, prefix, 'publisherId', publisherId, true)
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
            if (!record.id) return null
            const image = await prisma.image.findUnique({
              where: { publisherId: record.id }
            })
            return image && imageUrl(image.path)
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Logo', async (dataUri, context) => {
      if (!context.filter) return
      const records = await context.collection.list(context.filter, ['id'])
      await Promise.all(records.map((record) => uploadLogo(dataUri, record.id)))
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

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })

  collection.addHook('After', 'Update', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map(async (record) => {
        await revalidatePath('publishers', record.slug)
      })
    )
  })
}

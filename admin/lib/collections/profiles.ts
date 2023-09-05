import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

const uploadAvatar = async (dataUri: string, profileId: string) => {
  if (!dataUri) {
    await deleteImage({ profileId })
    return
  }

  const prefix = `profile-avatars/${profileId}`
  await uploadImage(dataUri, prefix, 'profileId', profileId, true)
}

export const customiseProfiles = (
  collection: CollectionCustomizer<Schema, 'profiles'>
) => {
  collection
    .addField('Avatar', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            if (!record.id) return
            const image = await prisma.image.findUnique({
              where: { profileId: record.id }
            })
            return image?.path
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Avatar', async (dataUri, context) => {
      if (!context.record.id) return
      await uploadAvatar(dataUri, context.record.id)
    })

  collection.addExternalRelation('Authored Books', {
    schema: {
      Title: 'String'
    },
    dependencies: ['id'],
    async listRecords(record) {
      const books = await prisma.book.findMany({
        where: {
          authors: { some: { id: record.id } }
        }
      })
      return books.map((book) => ({ Title: book.title }))
    }
  })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((profile) => {
      profile.slug ||= slugify(profile.name)
    })
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map((record) => deleteImage({ profileId: record.id }))
    )
  })

  collection.addAction('Feature this profile', {
    scope: 'Single',
    async execute(ctx, result) {
      const profileId = `${await ctx.getRecordId()}`

      await prisma.featuredProfile.upsert({
        where: { profileId },
        create: { profileId },
        update: {}
      })

      return result.success(`Profile ${profileId} featured`)
    }
  })
}

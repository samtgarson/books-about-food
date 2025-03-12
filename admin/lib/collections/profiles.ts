import prisma from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { resourceAction } from 'lib/utils/actions'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { Schema } from '../../.schema/types'

const uploadAvatar = async (dataUri: string, profileId: string) => {
  if (!dataUri) {
    await deleteImage({ profileId })
    return
  }

  const prefix = `profile-avatars/${profileId}`
  return await uploadImage(dataUri, prefix, 'profileId', profileId, true)
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
            return image ? imageUrl(image.path) : null
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Avatar', async (dataUri, context) => {
      if (!context.filter) return
      const records = await context.collection.list(context.filter, ['id'])
      await Promise.all(
        records.map((record) => uploadAvatar(dataUri, record.id))
      )
    })

  collection.addManyToManyRelation(
    'Authored Books',
    'books',
    '_authored_books',
    {
      originKey: 'B',
      foreignKey: 'A'
    }
  )

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((profile) => {
      profile.slug ||= slugify(profile.name)
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map(async (record, i) => {
        const data = context.data[i]

        await uploadAvatar(data.Avatar, record.id)
      })
    )
    await revalidatePath('')
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map((record) => deleteImage({ profileId: record.id }))
    )
  })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })

  collection.addHook('After', 'Update', async (context) => {
    const records = await context.collection.list(context.filter, [
      'id',
      'slug'
    ])
    await Promise.all(
      records.map(async (record) => {
        await revalidatePath('authors', record.slug)
        await revalidatePath('people', record.slug)
      })
    )
    await revalidatePath('')
  })

  collection.addHook('After', 'Delete', async () => {
    await revalidatePath('')
  })

  /* =============================================
   * ACTIONS
   * ============================================= */

  collection.addAction('↗️  View in BAF', {
    scope: 'Single',
    execute: async (context, result) => {
      const { slug } = await context.getRecord(['slug'])
      return result.redirectTo(appUrl(`/people/${slug}`))
    }
  })

  resourceAction({
    collection,
    name: '🌟 Feature on the homepage',
    async fn(id) {
      const profileId = `${id}`

      await prisma.featuredProfile.upsert({
        where: { profileId },
        create: { profileId },
        update: {}
      })
      await revalidatePath('')
    }
  })
}

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
  return await uploadImage(dataUri, prefix, 'profileId', profileId, true)
}

export const customiseProfiles = (
  collection: CollectionCustomizer<Schema, 'profiles'>
) => {
  collection.addField('Avatar', {
    dependencies: ['id'],
    getValues: async (records) => {
      return Promise.all(
        records.map(async (record) => {
          if (!record.id) return
          const image = await prisma.image.findUnique({
            where: { profileId: record.id }
          })
          return image ? `${process.env.S3_DOMAIN}${image.path}` : null
        })
      )
    },
    columnType: 'String'
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
  })

  collection.addHook('Before', 'Update', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    if (records.length !== 1) return
    const record = records[0]

    if (context.patch.Avatar) {
      const image = await uploadAvatar(context.patch.Avatar, record.id)
      if (image) context.patch.Avatar = `${process.env.S3_DOMAIN}${image.path}`
    }
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map((record) => deleteImage({ profileId: record.id }))
    )
  })

  /* =============================================
   * ACTIONS
   * ============================================= */

  collection.addAction('↗️  View in BAF', {
    scope: 'Single',
    execute: async (context, result) => {
      const { slug } = await context.getRecord(['slug'])
      return result.redirectTo(
        `https://books-about-food-web.vercel.app/people/${slug}`
      )
    }
  })

  collection.addAction('🌟 Feature this profile', {
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

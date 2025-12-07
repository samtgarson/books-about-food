import { GooglePlacesGateway } from '@books-about-food/core/gateways/google-places'
import { findOrCreateLocation } from '@books-about-food/core/services/locations/find-or-create-location'
import prisma from '@books-about-food/database'
import { appUrl } from '@books-about-food/shared/utils/app-url'
import { imageUrl } from '@books-about-food/shared/utils/image-url'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { revalidatePath } from 'lib/services/revalidate-path'
import { resourceAction } from 'lib/utils/actions'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { z } from 'zod/v4'
import { Schema } from '../../.schema/types'

const places = new GooglePlacesGateway()

const uploadAvatar = async (dataUri: string, profileId: string) => {
  if (!dataUri) {
    await deleteImage({ profileId })
    return
  }

  const prefix = `profile-avatars/${profileId}`
  return await uploadImage(dataUri, prefix, 'profileId', profileId, true)
}

const newLocationFormSchema = z.object({
  ['Search for a location']: z.string()
})

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
      if (!context.filter || !dataUri) return
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
      profile.name = profile.name.trim()
      profile.slug ||= slugify(profile.name)
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map(async (record, i) => {
        const data = context.data[i]

        if (data.Avatar) {
          await uploadAvatar(data.Avatar, record.id)
        }
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

  resourceAction({
    collection,
    name: '📍 Add location',
    submitButtonLabel: 'Add to profile',
    successMessage: '✅ Profile updated successfully',
    form: [
      {
        label: 'Search for a location',
        type: 'String',
        widget: 'Dropdown',
        search: 'dynamic',
        placeholder: 'Start typing to search Google Places...',
        async options(_context, searchValue) {
          if (!searchValue || searchValue.length < 2) return []

          const results = await places.search(searchValue, 'forest-admin-token')

          return results.map(({ description, place_id }) => ({
            value: `${description}|${place_id}`,
            label: description
          }))
        }
      }
    ],
    async fn(id, { formValues }) {
      const parsed = newLocationFormSchema.safeParse(formValues).data
      const value = parsed?.['Search for a location']
      if (!value) throw new Error('Please select a location')

      const [displayText, placeId] = value.split('|')
      if (!placeId) throw new Error('Invalid location selection')

      const locationResult = await findOrCreateLocation.call({
        placeId,
        displayText
      })

      if (!locationResult.success) {
        throw new Error('Failed to fetch location details from Google Places')
      }

      const location = locationResult.data
      await prisma.location.update({
        where: { id: location.id },
        data: {
          placeId: location.placeId,
          displayText: location.displayText,
          country: location.country ?? null,
          region: location.region ?? null,
          latitude: location.latitude,
          longitude: location.longitude,
          profiles: {
            connect: { id: `${id}` }
          }
        }
      })
    }
  })
}

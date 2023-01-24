import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { deleteImage, uploadImage } from 'lib/utils/image-utils'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

const updateWithJobs = async (id: string, jobNames: string[]) => {
  const jobs = await prisma.job.findMany({
    where: { name: { in: jobNames } }
  })

  await prisma.profile.update({
    where: { id },
    data: { jobs: { set: jobs.map((job) => ({ id: job.id })) } }
  })
}

const uploadAvatar = async (dataUri: string, profileId: string) => {
  if (!dataUri) {
    await deleteImage({ profileId })
    return
  }

  const prefix = `profile-avatars/${profileId}`
  await uploadImage(dataUri, prefix, 'profileId', profileId)
}

export const customiseProfiles = (
  collection: CollectionCustomizer<Schema, 'profiles'>
) => {
  collection
    .addField('jobs', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const jobs = await prisma.job.findMany({
              where: { profiles: { some: { id: record.id } } }
            })
            return jobs.map((job) => job.name)
          })
        )
      },
      columnType: ['String']
    })
    .replaceFieldWriting('jobs', async (jobNames = [], context) => {
      if (context.record.id) return updateWithJobs(context.record.id, jobNames)
    })
    .emulateFieldSorting('jobs')
    .emulateFieldOperator('jobs', 'IncludesAll')

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
            return image?.url
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Avatar', async (dataUri, context) => {
      if (!context.record.id) return
      await uploadAvatar(dataUri, context.record.id)
    })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((profile) => {
      profile.slug ||= slugify(profile.name)
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.flatMap((profile, i) => [
        updateWithJobs(profile.id, context.data[i].jobs),
        uploadAvatar(context.data[i].Avatar, profile.id)
      ])
    )
  })

  collection.addHook('Before', 'Delete', async (context) => {
    const records = await context.collection.list(context.filter, ['id'])
    await Promise.all(
      records.map((record) => deleteImage({ profileId: record.id }))
    )
  })
}

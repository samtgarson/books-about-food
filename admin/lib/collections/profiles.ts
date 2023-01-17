import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Schema } from '../../.schema/types'

export const customiseProfiles = (
  collection: CollectionCustomizer<Schema, 'profiles'>
) => {
  collection
    .addField('Jobs', {
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
    .replaceFieldWriting('Jobs', async (jobNames = [], context) => {
      const jobs = await prisma.job.findMany({
        where: { name: { in: jobNames } }
      })

      await prisma.profile.update({
        where: { id: context.record.id },
        data: { jobs: { connect: jobs.map((job) => ({ id: job.id })) } }
      })
    })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((profile) => {
      profile.slug ||= slugify(profile.name)
    })
  })
}

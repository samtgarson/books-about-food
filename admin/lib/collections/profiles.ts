import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
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

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((profile) => {
      profile.slug ||= slugify(profile.name)
    })
  })

  collection.addHook('After', 'Create', async (context) => {
    await Promise.all(
      context.records.map((profile, i) =>
        updateWithJobs(profile.id, context.data[i].jobs)
      )
    )
  })
}

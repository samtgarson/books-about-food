import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { Schema } from '../../.schema/types'

export const customiseContributions = (
  collection: CollectionCustomizer<Schema, 'contributions'>
) => {
  collection.addField('Display Name', {
    dependencies: ['book:title', 'profile:name'],
    getValues(records) {
      return records.map((r) => `${r.profile.name} on ${r.book.title}`)
    },
    columnType: 'String'
  })

  collection
    .addField('Job Titles', {
      columnType: ['String'],
      dependencies: ['id'],
      getValues: async (records) => {
        const ids = records.map((r) => r.id)
        const jobs = await prisma.job.findMany({
          where: { contributions: { some: { id: { in: ids } } } },
          include: { contributions: { select: { id: true } } }
        })

        return records.map((r) =>
          jobs
            .filter((job) => job.contributions.some((c) => c.id === r.id))
            .map((job) => job.name)
        )
      }
    })
    .replaceFieldWriting('Job Titles', async (titles, context) => {
      const jobs = await prisma.job.findMany({
        where: { name: { in: titles } }
      })
      const set = jobs.map((job) => ({ id: job.id }))

      await prisma.contribution.update({
        where: { id: context.record.id },
        data: { jobs: { set } }
      })
    })
}

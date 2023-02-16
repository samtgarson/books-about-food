import { CollectionCustomizer } from '@forestadmin/agent'
import prisma from 'database'
import { Schema } from '../../.schema/types'

export const customiseLinks = (
  collection: CollectionCustomizer<Schema, 'links'>
) => {
  collection
    .addField('Website', {
      dependencies: ['id'],
      getValues: async (records) => {
        return Promise.all(
          records.map(async (record) => {
            const link = await prisma.link.findUnique({
              where: { id: record.id }
            })
            return link?.site
          })
        )
      },
      columnType: 'String'
    })
    .replaceFieldWriting('Website', async (site, context) => {
      return { site: site || context.record['Website (Other)'] }
    })

  collection
    .addField('Website (Other)', {
      getValues: async (records) => {
        return records.map((record) => record.site)
      },
      columnType: 'String',
      dependencies: ['site']
    })
    .replaceFieldWriting('Website (Other)', async (site) => {
      return { 'Website (Other)': site }
    })
    .addHook('Before', 'Create', async (context) => {
      context.data.forEach((link) => {
        if (!link.site && !link['Website (Other)']) {
          context.throwValidationError('Please provide a site name')
        }

        link.site = link.site || link['Website (Other)']
        console.log(link)
      })
    })
    .addHook('Before', 'Update', async (context) => {
      console.log(context.patch)
      if (
        context.patch.site === null &&
        context.patch['Website (Other)'] === null
      ) {
        context.throwValidationError('Please provide a site name')
      }

      context.patch.site =
        context.patch.site || context.patch['Website (Other)']
      console.log(context.patch)
    })
}

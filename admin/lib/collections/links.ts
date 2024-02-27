import prisma from '@books-about-food/database'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseLinks = (
  collection: CollectionCustomizer<Schema, 'links'>
) => {
  collection
    .removeField('site')
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
    .replaceFieldWriting('Website', async (Website) => {
      return { Website }
    })

  collection
    .addField('WebsiteOther', {
      getValues: async (records) => {
        return records.map(() => null)
      },
      columnType: 'String',
      dependencies: ['site']
    })
    .replaceFieldWriting('WebsiteOther', async (site) => {
      return { WebsiteOther: site }
    })
    .addHook('Before', 'Create', async (context) => {
      context.data.forEach((link) => {
        if (!link.Website && !link['WebsiteOther']) {
          context.throwValidationError('Please provide a site name')
        }

        link.site = link.Website || link['WebsiteOther']
      })
    })
    .addHook('Before', 'Update', async (context) => {
      if (
        context.patch.Website === null &&
        context.patch['WebsiteOther'] === null
      ) {
        context.throwValidationError('Please provide a site name')
      }

      context.patch.site =
        context.patch.Website || context.patch['WebsiteOther']
    })

  collection.addHook('Before', 'Update', async (context) => {
    context.patch.updated_at = new Date().toISOString()
  })
}

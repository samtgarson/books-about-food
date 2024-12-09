import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseCollections = (
  collection: CollectionCustomizer<Schema, 'collections'>
) => {
  collection
    .removeField('slug')
    .addField('Slug', {
      dependencies: ['slug'],
      columnType: 'String',
      getValues(records) {
        return records.map((record) => record.slug)
      }
    })
    .replaceFieldWriting('slug', async (slug) => {
      return { slug }
    })

  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((collection) => {
      collection.slug ||= slugify(collection.title, { withHash: false })
      console.log(collection)
    })
  })

  collection.addHook('Before', 'Update', async (context) => {
    if (context.patch.title)
      context.patch.slug = slugify(context.patch.title, { withHash: false })
    context.patch.updated_at = new Date().toISOString()
  })
}

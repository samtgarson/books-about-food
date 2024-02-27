import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseTags = (
  collection: CollectionCustomizer<Schema, 'tags'>
) => {
  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((tag) => {
      tag.slug ||= slugify(tag.name)
    })
  })

  collection.addHook('Before', 'Update', async (context) => {
    if (context.patch.name) context.patch.slug = slugify(context.patch.name)
    context.patch.updated_at = new Date().toISOString()
  })
}

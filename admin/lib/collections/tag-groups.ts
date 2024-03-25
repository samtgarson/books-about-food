import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseTagGroups = (
  collection: CollectionCustomizer<Schema, 'tag_groups'>
) => {
  collection.addHook('Before', 'Create', async (context) => {
    context.data.forEach((group) => {
      group.slug ||= slugify(group.name, { withHash: false })
    })
  })

  collection.addHook('Before', 'Update', async (context) => {
    if (context.patch.name)
      context.patch.slug = slugify(context.patch.name, { withHash: false })
    context.patch.updated_at = new Date().toISOString()
  })
}

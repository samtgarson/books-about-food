import { slugify } from '@books-about-food/shared/utils/slugify'
import { CollectionCustomizer } from '@forestadmin/agent'
import { Schema } from '../../.schema/types'

export const customiseTeams = (
  collection: CollectionCustomizer<Schema, 'teams'>
) => {
  collection.addManyToManyRelation('Users', 'users', 'memberships', {
    originKey: 'team_id',
    foreignKey: 'user_id'
  })

  collection.addHook('Before', 'Create', async (ctx) => {
    for (const record of ctx.data) {
      record.slug = slugify(record.name)
    }
  })

  collection.addHook('Before', 'Update', async (ctx) => {
    if (ctx.patch.name) {
      ctx.patch.slug = slugify(ctx.patch.name)
    }
  })
}

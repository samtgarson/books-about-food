import type { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'

export const TagGroups: CollectionConfig = {
  slug: 'tag-groups',
  admin: {
    group: 'Metadata',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'adminOnly']
  },
  labels: {
    singular: 'Tag Group',
    plural: 'Tag Groups'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    slugField('name'),
    {
      name: 'adminOnly',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'tags',
      type: 'join',
      collection: 'tags',
      on: 'group'
    }
  ]
}

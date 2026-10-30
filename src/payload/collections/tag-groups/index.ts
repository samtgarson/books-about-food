import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin } from '../../access'
import { slugField } from '../../fields/slug'

export const TagGroups: CollectionConfig = {
  slug: 'tag-groups',
  access: {
    read: function ({ req }) {
      return isAdmin(req) || { adminOnly: { equals: false } }
    },
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
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

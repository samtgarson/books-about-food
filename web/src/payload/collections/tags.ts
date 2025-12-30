import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    group: 'Metadata',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'group']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'group',
      type: 'relationship',
      required: true,
      relationTo: 'tag-groups',
      hasMany: false
    },
    {
      name: 'books',
      type: 'join',
      collection: 'books',
      on: 'tags'
    }
  ]
}

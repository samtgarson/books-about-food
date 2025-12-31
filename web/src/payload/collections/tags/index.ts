import type { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  custom: { revalidatePaths: () => ['/cookbooks', '/people'] },
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
    slugField('name'),
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

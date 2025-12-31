import type { CollectionConfig } from 'payload'

export const Pitches: CollectionConfig = {
  slug: 'pitches',
  admin: {
    group: 'Beta Features',
    useAsTitle: 'id',
    defaultColumns: ['author', 'description', 'viewCount']
  },
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      required: true
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true }
    }
  ]
}

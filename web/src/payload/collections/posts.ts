import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Beta Features',
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishAt']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true }
    },
    {
      name: 'content',
      type: 'richText',
      required: true
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'publishAt',
      type: 'date',
      admin: { description: 'Schedule post for future publication' }
    },
    {
      name: 'images',
      type: 'join',
      collection: 'images',
      on: 'owner'
    }
  ]
}

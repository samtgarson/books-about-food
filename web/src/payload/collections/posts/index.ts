import type { CollectionConfig } from 'payload'
import { editorField } from 'src/payload/fields/editor'
import { slugField } from '../../fields/slug'

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
    slugField('title'),
    editorField('content', {
      required: true,
      placeholder: 'Write your post content here...'
    }),
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
      type: 'relationship',
      relationTo: 'images',
      hasMany: true
    }
  ]
}

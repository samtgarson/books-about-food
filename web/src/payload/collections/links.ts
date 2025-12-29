import type { CollectionConfig } from 'payload'

export const Links: CollectionConfig = {
  slug: 'links',
  dbName: 'links',
  admin: {
    useAsTitle: 'url',
    defaultColumns: ['url', 'site', 'bookId']
  },
  labels: {
    singular: 'Book Link',
    plural: 'Book Links'
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      required: true,
      relationTo: 'books',
      hasMany: false
    },
    {
      name: 'url',
      type: 'text',
      required: true
    },
    {
      name: 'site',
      type: 'text',
      required: true,
      admin: { description: 'Website name (e.g. Bookshop.org, Amazon)' }
    }
  ]
}

import type { CollectionConfig } from 'payload'

export const Features: CollectionConfig = {
  slug: 'features',
  dbName: 'features',
  admin: {
    useAsTitle: 'bookId',
    defaultColumns: ['bookId', 'tagLine', 'order', 'until']
  },
  labels: {
    singular: 'Featured Book',
    plural: 'Featured Books'
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true,
      hasMany: false
    },
    {
      name: 'tagLine',
      type: 'text'
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'until',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' }
      }
    }
  ]
}

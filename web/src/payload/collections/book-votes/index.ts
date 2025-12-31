import type { CollectionConfig } from 'payload'

export const BookVotes: CollectionConfig = {
  slug: 'book-votes',
  admin: {
    group: 'Beta Features',
    useAsTitle: 'id',
    defaultColumns: ['book', 'user']
  },
  access: {
    create: () => false
  },
  labels: {
    singular: 'Book Vote',
    plural: 'Book Votes'
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    }
  ]
}

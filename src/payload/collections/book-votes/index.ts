import type { CollectionConfig } from 'payload'
import { adminOnly, ownedBy } from '../../access'

export const BookVotes: CollectionConfig = {
  slug: 'book-votes',
  admin: {
    group: 'Beta Features',
    useAsTitle: 'id',
    defaultColumns: ['book', 'user']
  },
  access: {
    read: ownedBy('user'),
    create: () => false,
    update: adminOnly,
    delete: adminOnly
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

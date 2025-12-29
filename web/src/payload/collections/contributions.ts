import type { CollectionConfig } from 'payload'

export const Contributions: CollectionConfig = {
  slug: 'contributions',
  dbName: 'contributions',
  admin: {
    useAsTitle: 'id',
    hidden: true,
    defaultColumns: ['profileId', 'bookId', 'jobId', 'tag']
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true
    },
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true
    },
    {
      name: 'tag',
      type: 'select', // "Assistant" or null,
      options: [{ label: 'Assistant', value: 'Assistant' }]
    },
    {
      name: 'hidden',
      type: 'checkbox',
      defaultValue: false
    }
  ]
}

import type { CollectionConfig } from 'payload'

export const Claims: CollectionConfig = {
  slug: 'claims',
  dbName: 'claims',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['profileId', 'userId', 'approvedAt', 'cancelledAt']
  },
  fields: [
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      hasMany: false
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false
    },
    {
      name: 'secret',
      type: 'text',
      required: true,
      admin: { readOnly: true }
    },
    {
      name: 'approvedAt',
      type: 'date'
    },
    {
      name: 'cancelledAt',
      type: 'date'
    }
  ]
}

import type { CollectionConfig } from 'payload'

export const Claims: CollectionConfig = {
  slug: 'claims',
  admin: {
    group: 'Users',
    description: 'Claims made by users to take ownership of their profile.',
    useAsTitle: 'id',
    defaultColumns: ['profile', 'user', 'approvedAt', 'cancelledAt']
  },
  access: {
    create: () => false
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

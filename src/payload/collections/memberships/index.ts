import type { CollectionConfig } from 'payload'

export const Memberships: CollectionConfig = {
  slug: 'memberships',
  admin: {
    group: 'Users',
    useAsTitle: 'id',
    defaultColumns: ['publisher', 'user', 'role']
  },
  fields: [
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      required: true
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' }
      ]
    }
  ]
}

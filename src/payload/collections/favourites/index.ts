import type { CollectionConfig } from 'payload'

export const Favourites: CollectionConfig = {
  slug: 'favourites',
  admin: {
    group: 'Users',
    useAsTitle: 'id',
    defaultColumns: ['profile', 'user']
  },
  access: {
    create: () => false
  },
  fields: [
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
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

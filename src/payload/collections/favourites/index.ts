import type { CollectionConfig } from 'payload'
import { adminOnly, ownedBy } from '../../access'

export const Favourites: CollectionConfig = {
  slug: 'favourites',
  admin: {
    group: 'Users',
    useAsTitle: 'id',
    defaultColumns: ['profile', 'user']
  },
  access: {
    read: ownedBy('user'),
    create: () => false,
    update: adminOnly,
    delete: adminOnly
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

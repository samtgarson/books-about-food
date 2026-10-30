import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../../access'
import { dayOnlyDisplayFormat } from '../utils'

export const FeaturedProfiles: CollectionConfig = {
  slug: 'featured-profiles',
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  custom: { revalidatePaths: () => ['/'] },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'profile',
    defaultColumns: ['profile', 'until']
  },
  labels: {
    singular: 'Featured Profile',
    plural: 'Featured Profiles'
  },
  fields: [
    {
      name: 'profile',
      type: 'relationship',
      required: true,
      relationTo: 'profiles',
      admin: { description: 'Profile UUID' },
      hasMany: false
    },
    {
      name: 'until',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: dayOnlyDisplayFormat
        }
      }
    }
  ]
}

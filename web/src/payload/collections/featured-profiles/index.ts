import type { CollectionConfig } from 'payload'
import { dayOnlyDisplayFormat } from '../utils'

export const FeaturedProfiles: CollectionConfig = {
  slug: 'featured-profiles',
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

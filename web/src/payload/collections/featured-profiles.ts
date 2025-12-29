import type { CollectionConfig } from 'payload'

export const FeaturedProfiles: CollectionConfig = {
  slug: 'featured-profiles',
  dbName: 'featured_profiles',
  admin: {
    useAsTitle: 'profileId',
    defaultColumns: ['profileId', 'until']
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
        date: { pickerAppearance: 'dayOnly' }
      }
    }
  ]
}

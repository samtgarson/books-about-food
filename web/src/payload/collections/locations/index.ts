import type { CollectionConfig } from 'payload'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    group: 'Metadata',
    useAsTitle: 'displayText',
    defaultColumns: ['displayText', 'country', 'region']
  },
  fields: [
    {
      name: 'locationSearch',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: 'src/payload/collections/locations/components/picker.tsx#LocationPicker'
          }
        }
      }
    },
    {
      name: 'placeId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Google Place ID'
      }
    },
    {
      name: 'displayText',
      type: 'text',
      required: true,
      admin: { readOnly: true }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true }
    },
    {
      name: 'country',
      type: 'text',
      admin: { readOnly: true }
    },
    {
      name: 'region',
      type: 'text',
      admin: { readOnly: true }
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
      admin: { readOnly: true }
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
      admin: { readOnly: true }
    },
    {
      name: 'profiles',
      type: 'join',
      collection: 'profiles',
      on: 'locations'
    }
  ]
}

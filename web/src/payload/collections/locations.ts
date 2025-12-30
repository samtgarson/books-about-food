import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    group: 'Metadata',
    useAsTitle: 'displayText',
    defaultColumns: ['displayText', 'country', 'region']
  },
  fields: [
    {
      name: 'placeId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Google Place ID' }
    },
    {
      name: 'displayText',
      type: 'text',
      required: true
    },
    slugField('displayText'),
    {
      name: 'country',
      type: 'text'
    },
    {
      name: 'region',
      type: 'text'
    },
    {
      name: 'latitude',
      type: 'number',
      required: true
    },
    {
      name: 'longitude',
      type: 'number',
      required: true
    },
    {
      name: 'profiles',
      type: 'join',
      collection: 'profiles',
      on: 'locations'
    }
  ]
}

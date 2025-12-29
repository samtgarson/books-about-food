import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  dbName: 'jobs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true
    }
  ]
}

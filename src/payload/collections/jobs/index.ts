import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../../access'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  admin: {
    group: 'Metadata',
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

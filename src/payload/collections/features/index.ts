import type { CollectionConfig } from 'payload'
import { adminOnly, anyone } from '../../access'
import { dayOnlyDisplayFormat } from '../utils'

export const Features: CollectionConfig = {
  slug: 'features',
  access: {
    read: anyone,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'book',
    defaultColumns: ['book', 'tagLine', 'until']
  },
  labels: {
    singular: 'Featured Book',
    plural: 'Featured Books'
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true,
      hasMany: false
    },
    {
      name: 'tagLine',
      type: 'text'
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

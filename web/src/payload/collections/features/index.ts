import type { CollectionConfig } from 'payload'
import { dayOnlyDisplayFormat } from '../utils'

export const Features: CollectionConfig = {
  slug: 'features',
  orderable: true,
  admin: {
    group: 'Content',
    useAsTitle: 'book',
    defaultColumns: ['book', 'tagLine', 'order', 'until']
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

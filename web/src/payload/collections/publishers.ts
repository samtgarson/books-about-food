import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Publishers: CollectionConfig = {
  slug: 'publishers',
  admin: {
    group: 'Resources',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'website']
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    slugField('name'),
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'images',
      hasMany: false
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'website',
      type: 'text'
    },
    {
      name: 'instagram',
      type: 'text'
    },
    {
      name: 'genericContact',
      type: 'email'
    },
    {
      name: 'directContact',
      type: 'email'
    },
    {
      name: 'house',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false,
      label: 'Publishing House'
    },
    {
      name: 'hiddenBooks',
      type: 'relationship',
      relationTo: 'books',
      hasMany: true,
      admin: {
        description: 'Books hidden from this publisher page'
      }
    },
    {
      name: 'imprints',
      type: 'join',
      collection: 'publishers',
      on: 'house'
    },
    {
      name: 'books',
      type: 'join',
      collection: 'books',
      on: 'publisher'
    }
  ]
}

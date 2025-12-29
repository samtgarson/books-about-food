import type { CollectionConfig } from 'payload'

export const Publishers: CollectionConfig = {
  slug: 'publishers',
  dbName: 'publishers',
  admin: {
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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true }
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
      hasMany: false
    },
    {
      name: 'hiddenBooks',
      type: 'relationship',
      relationTo: 'books',
      hasMany: true,
      admin: {
        description: 'Books hidden from this publisher page'
      }
    }
  ]
}

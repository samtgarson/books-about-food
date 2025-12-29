import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  dbName: 'collections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status']
  },
  labels: {
    singular: 'Collection',
    plural: 'Collections'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'draft'
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false
    },
    {
      name: 'bookshopDotOrgUrl',
      type: 'text'
    },
    {
      name: 'publisherFeatured',
      type: 'checkbox',
      defaultValue: false
    }
  ]
}

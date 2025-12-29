import type { CollectionConfig } from 'payload'

export const Books: CollectionConfig = {
  slug: 'books',
  dbName: 'books',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publisher', 'releaseDate']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'subtitle',
      type: 'text'
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true }
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
      name: 'source',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Import', value: 'import' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Edelweiss', value: 'edelweiss' }
      ],
      defaultValue: 'admin',
      admin: { readOnly: true }
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' }
      }
    },
    {
      name: 'pages',
      type: 'number'
    },
    {
      name: 'blurb',
      type: 'textarea'
    },
    {
      name: 'designCommentary',
      type: 'textarea'
    },
    {
      name: 'backgroundColor',
      type: 'json',
      admin: { description: 'HSL color object {h, s, l}' }
    },
    {
      name: 'palette',
      type: 'json',
      admin: { description: 'Array of color strings' }
    },
    {
      name: 'googleBooksId',
      type: 'text',
      admin: { readOnly: true }
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { readOnly: true }
    }
  ]
}

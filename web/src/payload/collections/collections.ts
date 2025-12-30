import { slugify } from '@books-about-food/shared/utils/slugify'
import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  admin: {
    group: 'Resources',
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
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data?.title) return null
            return slugify(data.title as string)
          }
        ]
      }
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
      label: 'Bookshop.org URL',
      type: 'text'
    },
    {
      name: 'publisherFeatured',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'books',
      type: 'relationship',
      relationTo: 'books',
      hasMany: true,
      admin: { description: 'Books in this collection' }
    }
  ]
}

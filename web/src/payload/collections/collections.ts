import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { revalidatePaths } from '../plugins/cache-revalidation'

export const Collections: CollectionConfig = {
  slug: 'collections',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/collections/${doc.slug}`,
      '/collections',
      '/'
    ])
  },
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
    slugField('title'),
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

import type { CollectionConfig } from 'payload'
import { slugField } from '../../fields/slug'
import { revalidatePaths } from '../../plugins/cache-revalidation'

export const Publishers: CollectionConfig = {
  slug: 'publishers',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/publishers/${doc.slug}`,
      '/publishers',
      '/'
    ])
  },
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
      type: 'upload',
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
      label: 'Publishing House',
      admin: { position: 'sidebar' }
    },
    {
      name: 'imprints',
      type: 'join',
      collection: 'publishers',
      on: 'house',
      admin: { position: 'sidebar' }
    },
    {
      name: 'hiddenBooks',
      type: 'relationship',
      relationTo: 'books',
      hasMany: true,
      admin: {
        description: 'Books hidden from this publisher page',
        position: 'sidebar'
      }
    },
    {
      name: 'books',
      type: 'join',
      collection: 'books',
      on: 'publisher',
      admin: { defaultColumns: ['title', 'status', 'authors'] }
    },
    {
      name: 'memberships',
      type: 'join',
      collection: 'memberships',
      on: 'publisher',
      admin: {
        defaultColumns: ['user', 'role']
      }
    },
    {
      name: 'claimed',
      type: 'checkbox',
      virtual: true,
      // admin: { hidden: true },
      hooks: {
        afterRead: [
          async function ({ siblingData }) {
            return siblingData.memberships?.docs?.length > 0
          }
        ]
      }
    }
  ]
}

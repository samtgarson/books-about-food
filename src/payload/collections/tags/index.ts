import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin } from '../../access'
import { slugField } from '../../fields/slug'
import {
  deleteTagSearchResult,
  syncTagSearchResult
} from './hooks/sync-search-result'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    read: function ({ req }) {
      return isAdmin(req) || { 'group.adminOnly': { equals: false } }
    },
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly
  },
  custom: { revalidatePaths: () => ['/cookbooks', '/people'] },
  hooks: {
    afterChange: [syncTagSearchResult],
    afterDelete: [deleteTagSearchResult]
  },
  admin: {
    group: 'Metadata',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'group']
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
      name: 'group',
      type: 'relationship',
      required: true,
      relationTo: 'tag-groups',
      hasMany: false
    },
    {
      name: 'books',
      type: 'join',
      collection: 'books',
      on: 'tags'
    }
  ]
}

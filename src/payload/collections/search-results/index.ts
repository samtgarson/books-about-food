import type { CollectionConfig } from 'payload'

export const searchResultTypes = [
  'book',
  'profile',
  'publisher',
  'bookTag',
  'collection'
] as const

export type SearchResultType = (typeof searchResultTypes)[number]

/**
 * SearchResults is a hidden collection that stores denormalized search data.
 * It replaces the PostgreSQL view that was used with Prisma.
 *
 * This collection is populated via afterChange/afterDelete hooks on:
 * - Books (creates 'book' entries)
 * - Profiles (creates 'profile' entries)
 * - Publishers (creates 'publisher' entries)
 * - Tags (creates 'bookTag' entries)
 * - Collections (creates 'collection' entries)
 */
export const SearchResults: CollectionConfig = {
  slug: 'search-results',
  admin: {
    group: 'System',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'slug'],
    hidden: true
  },
  access: {
    // Read-only from external access - only hooks can modify
    create: () => false,
    update: () => false,
    delete: () => false
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: searchResultTypes.map((type) => ({
        label: type,
        value: type
      })),
      index: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true
    },
    {
      name: 'description',
      type: 'text'
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'images',
      hasMany: false,
      admin: {
        description: 'Image for search results display (cover, avatar, logo)'
      }
    },
    {
      name: 'source',
      type: 'relationship',
      relationTo: ['books', 'profiles', 'publishers', 'tags', 'collections'],
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'The source document this search result represents'
      }
    }
  ]
}

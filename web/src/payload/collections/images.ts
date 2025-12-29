import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  dbName: 'images',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'width', 'height'],
    hidden: true
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'width',
      type: 'number',
      required: true
    },
    {
      name: 'height',
      type: 'number',
      required: true
    },
    {
      name: 'caption',
      type: 'text'
    },
    {
      name: 'placeholderUrl',
      type: 'text'
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0
    },
    {
      name: 'coverForId',
      type: 'text',
      admin: { description: 'Book UUID (cover image)' }
    },
    {
      name: 'previewForId',
      type: 'text',
      admin: { description: 'Book UUID (preview image)' }
    },
    {
      name: 'publisherId',
      type: 'text',
      admin: { description: 'Publisher UUID (logo)' }
    },
    {
      name: 'profileId',
      type: 'text',
      admin: { description: 'Profile UUID (avatar)' }
    },
    {
      name: 'postId',
      type: 'text',
      admin: { description: 'Post UUID' }
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: { readOnly: true }
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: { readOnly: true }
    }
  ]
}

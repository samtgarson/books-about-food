import type { CollectionConfig } from 'payload'

export const Images: CollectionConfig = {
  slug: 'images',
  admin: {
    group: 'Resources',
    useAsTitle: 'id',
    defaultColumns: ['owner', 'imageType', 'caption']
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: ['books', 'publishers', 'profiles', 'posts'],
      required: true,
      admin: { description: 'The entity this image belongs to' }
    },
    {
      name: 'imageType',
      type: 'select',
      required: true,
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Preview', value: 'preview' },
        { label: 'Logo', value: 'logo' },
        { label: 'Avatar', value: 'avatar' },
        { label: 'Post Image', value: 'post' }
      ]
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
    }
  ]
}

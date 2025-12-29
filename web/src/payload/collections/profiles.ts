import type { CollectionConfig } from 'payload'

export const Profiles: CollectionConfig = {
  slug: 'profiles',
  dbName: 'profiles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'jobTitle']
  },
  fields: [
    {
      name: 'name',
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
      name: 'jobTitle',
      type: 'text'
    },
    {
      name: 'location',
      type: 'text'
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
      name: 'mostRecentlyPublishedOn',
      type: 'date',
      admin: { readOnly: true }
    },
    {
      name: 'userId',
      type: 'text',
      admin: { description: 'Connected User UUID' }
    },
    {
      name: 'hiddenCollaborators',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: { description: 'Collaborators to hide from public view' }
    }
  ]
}

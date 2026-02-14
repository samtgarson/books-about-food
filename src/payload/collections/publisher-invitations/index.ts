import type { CollectionConfig } from 'payload'

export const PublisherInvitations: CollectionConfig = {
  slug: 'publisher-invitations',
  admin: {
    group: 'Users',
    useAsTitle: 'email',
    defaultColumns: ['email', 'publisher', 'role', 'acceptedAt']
  },
  labels: {
    singular: 'Publisher Invitation',
    plural: 'Publisher Invitations'
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      required: true
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' }
      ]
    },
    {
      name: 'acceptedAt',
      type: 'date'
    }
  ]
}

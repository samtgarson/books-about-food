import type { CollectionConfig } from 'payload'

export const Accounts: CollectionConfig = {
  slug: 'accounts',
  admin: {
    hidden: true
  },
  indexes: [
    {
      fields: ['provider', 'providerAccountId'],
      unique: true
    }
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'type',
      type: 'text',
      required: true
    },
    {
      name: 'provider',
      type: 'text',
      required: true
    },
    {
      name: 'providerAccountId',
      type: 'text',
      required: true
    },
    {
      name: 'refreshToken',
      type: 'text'
    },
    {
      name: 'accessToken',
      type: 'text'
    },
    {
      name: 'expiresAt',
      type: 'number'
    },
    {
      name: 'tokenType',
      type: 'text'
    },
    {
      name: 'scope',
      type: 'text'
    },
    {
      name: 'idToken',
      type: 'text'
    },
    {
      name: 'sessionState',
      type: 'text'
    }
  ]
}

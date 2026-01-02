import type { CollectionConfig } from 'payload'

export const VerificationTokens: CollectionConfig = {
  slug: 'verification-tokens',
  admin: {
    hidden: true
  },
  indexes: [
    {
      fields: ['identifier', 'token'],
      unique: true
    }
  ],
  fields: [
    {
      name: 'identifier',
      type: 'text',
      required: true
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'expires',
      type: 'date',
      required: true
    }
  ]
}

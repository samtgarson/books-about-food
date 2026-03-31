import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Users',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'emailVerified'],
    components: {
      edit: {
        beforeDocumentControls: [
          {
            path: 'src/payload/collections/users/components/approve-button.tsx#UserApproveButton'
          }
        ]
      }
    }
  },
  fields: [
    {
      name: 'memberships',
      type: 'join',
      collection: 'memberships',
      on: 'user'
    }
  ]
}

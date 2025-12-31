import type { CollectionConfig } from 'payload'
import { getUser } from 'src/utils/user'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'next-auth',
        async authenticate() {
          const user = await getUser()
          if (!user)
            return {
              user: null
            }

          if (user.role !== 'admin')
            return {
              user: null
            }

          return {
            user: {
              ...user,
              collection: 'users'
            }
          }
        }
      }
    ]
  },
  admin: {
    group: 'Users',
    useAsTitle: 'email',
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
      name: 'email',
      type: 'email',
      required: true,
      unique: true
    },
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
        { label: 'Waitlist', value: 'waitlist' }
      ],
      defaultValue: 'user'
    }
  ]
}

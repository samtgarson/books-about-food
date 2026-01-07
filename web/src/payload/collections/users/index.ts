import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // auth: {
  //   disableLocalStrategy: true,
  //   strategies: [
  //     {
  //       name: 'next-auth',
  //       async authenticate() {
  //         const user = await getUser()
  //         if (!user)
  //           return {
  //             user: null
  //           }

  //         if (user.role !== 'admin')
  //           return {
  //             user: null
  //           }

  //         return {
  //           user: {
  //             ...user,
  //             collection: 'users' as const,
  //             createdAt: user.createdAt.toISOString(),
  //             updatedAt: user.updatedAt.toISOString(),
  //             emailVerified: user.emailVerified?.toISOString() ?? null
  //           }
  //         }
  //       }
  //     }
  //   ]
  // },
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
    // {
    //   name: 'email',
    //   type: 'email',
    //   required: true,
    //   unique: true
    // },
    // {
    //   name: 'name',
    //   type: 'text'
    // },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
        { label: 'Waitlist', value: 'waitlist' }
      ],
      defaultValue: 'user'
    },
    {
      name: 'memberships',
      type: 'join',
      collection: 'memberships',
      on: 'user'
    }
    // {
    //   name: 'image',
    //   type: 'text',
    //   admin: {
    //     description: 'URL to the user avatar image'
    //   }
    // },
    // {
    //   name: 'emailVerified',
    //   type: 'date',
    //   admin: {
    //     readOnly: true
    //   }
    // },
    // {
    //   type: 'join',
    //   name: 'accounts',
    //   collection: 'accounts',
    //   on: 'user',
    //   admin: {
    //     allowCreate: false
    //   }
    // }
  ]
}

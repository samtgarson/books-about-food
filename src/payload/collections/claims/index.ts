import type { CollectionConfig } from 'payload'

export const Claims: CollectionConfig = {
  slug: 'claims',
  admin: {
    group: 'Users',
    groupBy: true,
    description: 'Claims made by users to take ownership of their profile.',
    useAsTitle: 'id',
    defaultColumns: ['profile', 'user', 'state', 'actions', 'approvedAt'],
    components: {
      edit: {
        beforeDocumentControls: [
          {
            path: 'src/payload/collections/claims/components/cancel-button.tsx#ClaimCancelButton'
          },
          {
            path: 'src/payload/collections/claims/components/approve-button.tsx#ClaimApproveButton'
          }
        ]
      }
    }
  },
  access: {
    create: () => false
  },
  fields: [
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      hasMany: false
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false
    },
    {
      name: 'secret',
      type: 'text',
      required: true,
      admin: { readOnly: true }
    },
    {
      name: 'approvedAt',
      type: 'date'
    },
    {
      name: 'cancelledAt',
      type: 'date'
    },
    {
      name: 'actions',
      type: 'ui',
      admin: {
        disableListColumn: false,
        components: {
          Cell: {
            path: 'src/payload/collections/claims/components/approve-cell.tsx#ClaimApproveCell'
          }
        }
      }
    },
    {
      name: 'state',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Cancelled', value: 'cancelled' }
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        readOnly: true,
        components: {
          Field: {
            path: 'src/payload/collections/claims/components/status.tsx#ClaimStatusField'
          },
          Cell: {
            path: 'src/payload/collections/claims/components/status.tsx#ClaimStatusCell'
          }
        }
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData?.cancelledAt) return 'cancelled'
            if (siblingData?.approvedAt) return 'approved'
            return 'pending'
          }
        ]
      }
    }
  ]
}

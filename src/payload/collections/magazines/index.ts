import type { CollectionConfig } from 'payload'
import { contributionTitleField } from '../../fields/contribution-title'
import { linksField } from '../../fields/links'
import { slugField } from '../../fields/slug'
import { revalidatePaths } from '../../plugins/cache-revalidation'

export const Magazines: CollectionConfig = {
  slug: 'magazines',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/magazines/${doc.slug}`,
      '/magazines'
    ])
  },
  admin: {
    group: 'Resources',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publisher', 'frequency']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    slugField('title'),
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      type: 'row',
      fields: [
        {
          name: 'frequency',
          type: 'select',
          interfaceName: 'MagazineFrequency',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Bi-monthly', value: 'bimonthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Biannual', value: 'biannual' },
            { label: 'Annual', value: 'annual' },
            { label: 'Irregular', value: 'irregular' }
          ]
        },
        {
          name: 'startYear',
          type: 'number',
          min: 1800
        },
        {
          name: 'endYear',
          type: 'number',
          min: 1800,
          admin: {
            description: 'Leave blank if still in print'
          }
        }
      ]
    },
    {
      name: 'team',
      type: 'array',
      interfaceName: 'MagazineTeam',
      admin: {
        description: 'The standing team, credited across issues',
        initCollapsed: true,
        components: {
          RowLabel: {
            path: 'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel',
            clientProps: {
              itemPlaceholder: 'New team member',
              keyPath: ['title']
            }
          }
        }
      },
      fields: [
        {
          name: 'profile',
          type: 'relationship',
          relationTo: 'profiles',
          required: true,
          hasMany: false
        },
        contributionTitleField,
        {
          name: 'job',
          type: 'relationship',
          relationTo: 'jobs',
          required: true
        },
        {
          type: 'row',
          fields: [
            {
              name: 'fromYear',
              type: 'number',
              min: 1800
            },
            {
              name: 'toYear',
              type: 'number',
              min: 1800,
              admin: {
                description: 'Leave blank if current'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'issues',
      type: 'join',
      collection: 'books',
      on: 'magazine',
      defaultSort: '-releaseDate',
      defaultLimit: 50,
      admin: {
        defaultColumns: ['title', 'issueNumber', 'releaseDate', 'status']
      }
    },
    linksField('MagazineLinks')
  ]
}

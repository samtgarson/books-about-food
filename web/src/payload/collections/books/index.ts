import { websites } from '@books-about-food/shared/data/websites'
import type { CollectionConfig, Data } from 'payload'
import { slugField } from '../../fields/slug'
import { revalidatePaths } from '../../plugins/cache-revalidation'
import { colorField, dayOnlyDisplayFormat } from '../utils'
import { triggerPaletteGeneration } from './hooks/trigger-palette-generation'

export const Books: CollectionConfig = {
  slug: 'books',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/cookbooks/${doc.slug}`,
      '/cookbooks',
      '/'
    ])
  },
  admin: {
    group: 'Resources',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'authors', 'publisher', 'releaseDate'],
    preview({ slug }) {
      return `/cookbooks/${slug}`
    },
    components: {
      edit: {
        beforeDocumentControls: [
          {
            path: 'src/payload/collections/books/components/publish-button.tsx#BookPublishButton'
          }
        ]
      }
    }
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'subtitle',
      type: 'text'
    },
    slugField('title'),
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'draft'
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: dayOnlyDisplayFormat
        }
      }
    },
    {
      name: 'pages',
      type: 'number'
    },
    {
      name: 'blurb',
      type: 'textarea'
    },
    {
      name: 'designCommentary',
      type: 'textarea',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Import', value: 'import' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Edelweiss', value: 'edelweiss' }
      ],
      defaultValue: 'admin',
      admin: { readOnly: true, position: 'sidebar' }
    },
    colorField('backgroundColor', {
      admin: {
        position: 'sidebar',
        description: 'Generated from the cover image'
      }
    }),
    {
      name: 'palette',
      type: 'array',
      fields: [colorField('color')],
      minRows: 3,
      maxRows: 3,
      admin: {
        position: 'sidebar',
        description: 'Generated from the cover image'
      }
    },
    {
      name: 'googleBooksId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' }
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { readOnly: true, position: 'sidebar' }
    },
    {
      name: 'links',
      type: 'array',
      interfaceName: 'BookLinks',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: {
            path: 'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel',
            clientProps: {
              itemPlaceholder: 'New link',
              keyPath: ['label']
            }
          }
        }
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true
        },
        {
          name: 'url',
          type: 'text',
          required: true
        },
        {
          name: 'site',
          type: 'select',
          options: [
            ...websites.map((site) => ({ label: site, value: site })),
            { label: 'Other', value: 'Other' }
          ],
          required: true
        },
        {
          name: 'site (other)',
          type: 'text',
          validate: (
            value: unknown,
            { siblingData }: { siblingData: Data }
          ) => {
            if (siblingData?.site === 'Other' && !value) {
              return 'Please specify the site name'
            }
            return true
          },
          admin: {
            condition: (data, siblingData) => siblingData?.site === 'Other'
          }
        }
      ]
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'images',
      hasMany: false,
      hooks: {
        afterChange: [triggerPaletteGeneration]
      }
    },
    {
      name: 'previewImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'images',
          hasMany: false,
          required: true
        }
      ]
    }
  ]
}

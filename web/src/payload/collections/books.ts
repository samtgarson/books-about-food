import { websites } from '@books-about-food/shared/data/websites'
import { slugify } from '@books-about-food/shared/utils/slugify'
import type { CollectionConfig, Data } from 'payload'

export const Books: CollectionConfig = {
  slug: 'books',
  admin: {
    group: 'Resources',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publisher', 'releaseDate'],
    preview({ slug }) {
      return `/cookbooks/${slug}`
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
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data?.title) return null
            return slugify(data.title)
          }
        ]
      }
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: { description: 'Primary authors of the book' }
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
        date: { pickerAppearance: 'dayOnly' }
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
    {
      name: 'backgroundColor',
      type: 'json',
      admin: { position: 'sidebar' }
    },
    {
      name: 'palette',
      type: 'array',
      fields: [
        {
          name: 'color',
          type: 'text'
        }
      ],
      minRows: 3,
      maxRows: 3,
      admin: { position: 'sidebar' }
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
        components: {
          RowLabel: {
            path: 'src/payload/components/array-row-label.tsx',
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
    }
  ]
}

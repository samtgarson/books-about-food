import { slugify } from '@books-about-food/shared/utils/slugify'
import type { CollectionConfig } from 'payload'

export const Profiles: CollectionConfig = {
  slug: 'profiles',
  admin: {
    group: 'Resources',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'jobTitle'],
    preview({ slug }) {
      return `/people/${slug}`
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data?.name) return null
            return slugify(data.name as string)
          }
        ]
      }
    },
    {
      name: 'avatar',
      type: 'relationship',
      relationTo: 'images',
      hasMany: false
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'jobTitle',
      type: 'text'
    },
    {
      name: 'location',
      type: 'text',
      hidden: true
    },
    {
      name: 'website',
      type: 'text'
    },
    {
      name: 'instagram',
      type: 'text'
    },
    {
      name: 'mostRecentlyPublishedOn',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' }
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { description: 'Connected user account', position: 'sidebar' }
    },
    {
      name: 'locations',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      admin: {
        description: 'Geographic locations associated with this profile'
      }
    },
    {
      name: 'contributions',
      type: 'array',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: {
            path: 'src/payload/components/array-row-label.tsx',
            clientProps: {
              itemPlaceholder: 'New contribution',
              keyPath: ['title']
            }
          }
        }
      },
      fields: [
        {
          name: 'book',
          type: 'relationship',
          relationTo: 'books',
          required: true
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            hidden: true
          },
          hooks: {
            beforeChange: [
              async ({ siblingData, req }) => {
                if (!siblingData.book || !siblingData.job) return null
                const [book, job] = await Promise.all([
                  req.payload.findByID({
                    id: siblingData.book,
                    collection: 'books'
                  }),
                  req.payload.findByID({
                    id: siblingData.job,
                    collection: 'jobs'
                  })
                ])
                if (!book || !job) return null
                return `${book.title} (${job.name})`
              }
            ]
          }
        },
        {
          name: 'job',
          type: 'relationship',
          relationTo: 'jobs',
          required: true
        },
        {
          name: 'tag',
          type: 'select', // "Assistant" or null,
          options: [{ label: 'Assistant', value: 'Assistant' }]
        },
        {
          name: 'hidden',
          type: 'checkbox',
          defaultValue: false
        }
      ]
    },
    {
      name: 'Claims',
      type: 'join',
      collection: 'claims',
      on: 'profile',
      admin: { position: 'sidebar' }
    }
  ]
}

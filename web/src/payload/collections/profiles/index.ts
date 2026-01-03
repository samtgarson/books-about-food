import { eq } from '@payloadcms/db-postgres/drizzle'
import type { CollectionConfig } from 'payload'
import { books, books_contributions, jobs } from 'src/payload-generated-schema'
import { slugField } from '../../fields/slug'
import { revalidatePaths } from '../../plugins/cache-revalidation'
import { dayOnlyDisplayFormat } from '../utils'

export const Profiles: CollectionConfig = {
  slug: 'profiles',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/people/${doc.slug}`,
      '/people',
      '/people/map',
      '/'
    ])
  },
  admin: {
    group: 'Resources',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'jobTitle'],
    preview({ slug }) {
      return `/people/${slug}`
    },
    components: {
      edit: {
        beforeDocumentControls: [
          {
            path: 'src/payload/collections/profiles/components/feature-button.tsx#ProfileFeatureButton'
          }
        ]
      }
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    slugField('name'),
    {
      name: 'avatar',
      type: 'upload',
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
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: dayOnlyDisplayFormat
        }
      }
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
      name: 'authoredBooks',
      type: 'join',
      collection: 'books',
      on: 'authors',
      hasMany: true,
      admin: { allowCreate: false }
    },
    {
      name: 'contributions',
      type: 'array',
      virtual: true,
      admin: {
        readOnly: true,
        initCollapsed: true,
        components: {
          RowLabel: {
            path: 'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel',
            clientProps: {
              itemPlaceholder: 'New contribution',
              keyPath: ['title']
            }
          }
        }
      },
      fields: [
        { name: 'title', type: 'text', admin: { hidden: true } },
        { name: 'book', type: 'relationship', relationTo: 'books' },
        { name: 'job', type: 'relationship', relationTo: 'jobs' }
      ],
      hooks: {
        afterRead: [
          async function ({ originalDoc, req }) {
            const [{ bookTitle, jobTitle, book, job }] =
              await req.payload.db.drizzle
                .select({
                  bookTitle: books.title,
                  jobTitle: jobs.name,
                  book: books_contributions._parentID,
                  job: books_contributions.job
                })
                .from(books_contributions)
                .innerJoin(books, eq(books.id, books_contributions._parentID))
                .innerJoin(jobs, eq(jobs.id, books_contributions.job))
                .where(eq(books_contributions.profile, originalDoc.id))

            const title =
              bookTitle && jobTitle ? `${bookTitle} (${jobTitle})` : null
            return { title, book, job }
          }
        ]
      }
    },
    {
      name: 'hiddenFrequentCollaborators',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        description:
          'Profiles to exclude from the "Frequent Collaborators" section on this profile page.',
        position: 'sidebar'
      }
    },
    {
      name: 'claims',
      type: 'join',
      collection: 'claims',
      on: 'profile',
      admin: { position: 'sidebar', allowCreate: false }
    }
  ]
}

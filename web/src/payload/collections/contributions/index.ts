import { eq } from '@payloadcms/db-postgres/drizzle'
import type { CollectionConfig } from 'payload'
import {
  books,
  contributions,
  jobs,
  profiles
} from 'src/payload-generated-schema'

export const Contributions: CollectionConfig = {
  slug: 'contributions',
  admin: {
    useAsTitle: 'title',
    hidden: true,
    defaultColumns: ['profile', 'book', 'job', 'tag']
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async function ({ siblingData, req, originalDoc: { id } }) {
            if (!siblingData.book || !siblingData.job || !siblingData.profile)
              return null
            const [{ bookTitle, jobName, profileName }] =
              await req.payload.db.drizzle
                .selectDistinct({
                  bookTitle: books.title,
                  jobName: jobs.name,
                  profileName: profiles.name
                })
                .from(contributions)
                .innerJoin(books, eq(books.id, contributions.book))
                .innerJoin(jobs, eq(jobs.id, contributions.job))
                .innerJoin(profiles, eq(profiles.id, contributions.profile))
                .where(eq(contributions.id, id))

            return `${profileName} - ${bookTitle} (${jobName})`
          }
        ]
      }
    },
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'books',
      required: true
    },
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true
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
}

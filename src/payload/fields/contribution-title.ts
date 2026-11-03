import { eq } from '@payloadcms/db-postgres/drizzle'
import type { TextField } from 'payload'
import { jobs, profiles } from 'src/payload/schema'

// Hidden "Name (Job)" label, used as the row title for profile + job arrays
export const contributionTitleField: TextField = {
  name: 'title',
  type: 'text',
  admin: {
    hidden: true
  },
  hooks: {
    beforeChange: [
      async function ({ siblingData, req }) {
        if (!siblingData.profile || !siblingData.job) return null

        const [[profile], [job]] = await Promise.all([
          req.payload.db.drizzle
            .select({ name: profiles.name })
            .from(profiles)
            .where(eq(profiles.id, siblingData.profile)),
          req.payload.db.drizzle
            .select({ name: jobs.name })
            .from(jobs)
            .where(eq(jobs.id, siblingData.job))
        ])

        if (!profile?.name || !job?.name) return null
        return `${profile.name} (${job.name})`
      }
    ]
  }
}

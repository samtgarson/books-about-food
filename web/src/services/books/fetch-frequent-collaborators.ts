import prisma from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { fetchProfile } from '../profiles/fetch-profile'

export const fetchFrequentCollaborators = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) return []

    const raw = await execute(slug)

    const profiles = await Promise.all(
      raw.map(({ slug }) => fetchProfile.call({ slug }))
    )

    return profiles.filter((profile): profile is Profile => !!profile)
  }
)

const execute = (slug: string) => prisma.$queryRaw<{ slug: string }[]>`
    SELECT
      p1.slug
    FROM
      profiles p1
      INNER JOIN contributions c1 ON p1.id = c1.profile_id
      INNER JOIN books ON books.id = c1.book_id
      INNER JOIN contributions c2 ON c2.book_id = books.id
      INNER JOIN profiles p2 ON p2.id = c2.profile_id
        AND p2.slug <> p1.slug
    WHERE
      p2.slug = ${slug}
      AND NOT (p1.slug = ANY (p2.hidden_collaborators))
    GROUP BY
      p1.slug
    HAVING
      count(DISTINCT books.slug) > 1
    ORDER BY
      count(DISTINCT books.slug) DESC
    `

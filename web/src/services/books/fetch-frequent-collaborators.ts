import prisma from 'database'
import { Profile } from 'src/models/profile'
import { Service } from 'src/utils/service'
import { z } from 'zod'
import { fetchProfile } from '../profiles/fetch-profile'

export const fetchFrequentCollaborators = new Service(
  z.object({ slug: z.string() }),
  async ({ slug } = {}) => {
    if (!slug) return []
    const raw = await prisma.$queryRaw<{ slug: string }[]>`
      select p1.slug from profiles p1
      inner join contributions c1 on p1.id = c1.profile_id
      inner join books on books.id = c1.book_id
      inner join contributions c2 on c2.book_id = books.id
      inner join profiles p2 on p2.id = c2.profile_id and p2.slug <> p1.slug
      where p2.slug = ${slug}
      group by p1.id
      order by count(distinct books.slug) desc
      limit 5
    `

    const profiles = await Promise.all(
      raw.map(({ slug }) => fetchProfile.call({ slug }))
    )

    return profiles.filter((profile): profile is Profile => !!profile)
  }
)

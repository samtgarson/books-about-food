import prisma, { Prisma, Profile } from 'database'
import { slugify } from 'shared/utils/slugify'
import { Base } from './base'

type CsvProfile = {
  Name: string
  Website: string
  Instagram: string
  'Job Title(s)': string
  Location: string
}

export class ProfileSeeder extends Base<
  CsvProfile,
  Prisma.ProfileCreateInput,
  Profile
> {
  table = 'profile'

  async transform(row: CsvProfile) {
    return {
      name: row.Name,
      slug: slugify(row.Name),
      website: row.Website,
      instagram: row.Instagram,
      jobTitle: row['Job Title(s)'],
      location: row.Location
    } satisfies Prisma.ProfileCreateInput
  }

  async save(data: Prisma.ProfileCreateInput) {
    return prisma.profile.create({ data })
  }
}

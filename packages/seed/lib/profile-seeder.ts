import prisma, { Prisma, Profile } from 'database'
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
    const jobs = await this.jobsFor(row)

    return {
      name: row.Name,
      website: row.Website,
      instagram: row.Instagram,
      jobs: { connect: jobs },
      location: row.Location
    } satisfies Prisma.ProfileCreateInput
  }

  async save(data: Prisma.ProfileCreateInput) {
    return prisma.profile.create({ data })
  }

  private async jobsFor(row: CsvProfile) {
    if (!row['Job Title(s)']) return
    const names = row['Job Title(s)'].split(',')
    const records = await prisma.job.findMany({
      where: { name: { in: names } }
    })
    return records.map((r) => ({ id: r.id }))
  }
}

import prisma, { Job, Prisma } from 'database'
import { Base } from './base'

type CsvJob = {
  Name: string
}

export class JobSeeder extends Base<CsvJob, Prisma.JobCreateInput, Job> {
  table = 'job'

  async transform(row: CsvJob) {
    return { name: row.Name }
  }

  async save(data: Prisma.JobCreateInput) {
    return prisma.job.create({ data })
  }
}

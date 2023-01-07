import prisma, { Prisma, Publisher } from 'database'
import { slugify } from 'shared/utils/slugify'
import { Base } from './base'

type CsvPublisher = {
  Name: string
  Website: string
  'Generic Contact': string
  'Direct Contact': string
  Instagram: string
  Imprint: string
}

export class PublisherSeeder extends Base<
  CsvPublisher,
  Prisma.PublisherCreateInput,
  Publisher
> {
  table = 'publisher'

  async transform(row: CsvPublisher) {
    return {
      name: row.Name,
      slug: slugify(row.Name),
      website: row.Website,
      genericContact: row['Generic Contact'],
      directContact: row['Direct Contact'],
      imprint: row.Imprint,
      instagram: row.Instagram
    } satisfies Prisma.PublisherCreateInput
  }

  async save(data: Prisma.PublisherCreateInput) {
    return prisma.publisher.create({ data })
  }
}

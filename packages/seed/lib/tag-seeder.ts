import prisma, { Tag, Prisma } from 'database'
import { Base } from './base'

type CsvTag = {
  Name: string
}

export class TagSeeder extends Base<CsvTag, Prisma.TagCreateInput, Tag> {
  table = 'tag'

  async transform(row: CsvTag) {
    return { name: row.Name }
  }

  async save(data: Prisma.TagCreateInput) {
    return prisma.tag.create({ data })
  }
}

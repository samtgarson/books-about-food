import prisma, { Book, Job, Prisma } from 'database'
import { parse } from 'date-fns'
import { Base } from './base'

type CsvBook = {
  Title: string
  Subtitle: string
  Author: string
  Publishers: string
  Published: string
  Pages: string
  Contributions: string
  Type: string
  'Cover Image': string
  'Other Images': string
  Links: string
}

export class BookSeeder extends Base<CsvBook, Prisma.BookCreateInput, Book> {
  table = 'book'

  async transform(row: CsvBook) {
    const publisher = await this.publisherFor(row)
    const contributions = await this.contributionsFor(row)
    const publishedOn = parse(row.Published, 'd/L/y', new Date())

    return {
      title: row.Title,
      pages: parseInt(row.Pages, 10),
      publishedOn,
      coverUrl: row['Cover Image']?.length > 0 ? row['Cover Image'] : undefined,
      imageUrls: row['Other Images']
        .split(',')
        .filter((str) => str?.length > 0),
      publisher: { connect: { id: publisher } },
      contributions,
      tags: row['Type']
        ?.split(',')
        .map((t) => t.trim())
        .filter((str) => str?.length > 0)
    } satisfies Prisma.BookCreateInput
  }

  async save(data: Prisma.BookCreateInput) {
    return prisma.book.create({ data })
  }

  private async publisherFor(row: CsvBook) {
    const publisher = await prisma.publisher.findFirst({
      where: { name: row.Publishers }
    })
    if (!publisher)
      throw new Error(`Could not find publisher ${row.Publishers}`)
    return publisher.id
  }

  private async contributionsFor(
    row: CsvBook
  ): Promise<Prisma.BookCreateInput['contributions']> {
    const contributions = row['Contributions'].split(',')
    const create: Prisma.ContributionCreateWithoutBookInput[] = []

    for (const contribution of contributions) {
      const [name, jobString] = contribution.split('|')
      if (!name) continue
      const jobs = jobString.split('/').map((j) => j.trim())

      const jobRecords = await Promise.all(
        jobs.map((job) => prisma.job.findFirst({ where: { name: job } }))
      )
      const profileRecord = await prisma.profile.findFirst({ where: { name } })

      if (!profileRecord)
        throw new Error(`Could not find profile with name ${name}`)
      create.push({
        jobs: {
          connect: jobRecords
            .filter((r): r is Job => !!r)
            .map((r) => ({ id: r.id }))
        },
        profile: { connect: { id: profileRecord.id } }
      })
    }

    return { create }
  }
}

import { parseFile, Row } from '@fast-csv/parse'
import { Prisma } from 'database'
import path from 'path'
import { getEnv } from 'shared/utils/get-env'
import getImageSize from 'url-image-size'

const dataDir = process.env.DATA_DIR ?? 'data'

export abstract class Base<
  In extends Row,
  Out extends Row,
  Result extends Record<string, unknown>
> {
  protected abstract table: string
  protected rows: In[] = []

  async call() {
    this.rows = await this.parseTable()
    const transformed = await Promise.all(
      this.rows.map(this.transform.bind(this))
    )
    return Promise.all(
      transformed.map(async (row) => {
        try {
          return await this.save(row)
        } catch (e) {
          // @ts-expect-error - all rows either have a title or a name
          console.log(`Failed to save record:\n${row['title'] || row['name']}`)
          console.log((e as Error).message)
          throw e
        }
      })
    )
  }

  private parseTable() {
    return new Promise<In[]>((resolve, reject) => {
      const file = path.resolve(__dirname, '..', dataDir, this.table + '.csv')
      const records: In[] = []
      parseFile<In, In>(file, { headers: true })
        .on('data', (row) => records.push(row))
        .on('close', () => resolve(records))
        .on('error', reject)
    })
  }

  abstract transform(row: In): Promise<Out>
  abstract save(record: Out): Promise<Result>

  protected async imageAttrs(
    path?: string
  ): Promise<Prisma.ImageCreateInput | undefined> {
    if (!path) return undefined
    const url = new URL(path, getEnv('S3_DOMAIN'))
    const { width, height } = await getImageSize(
      // @ts-expect-error - url-image-size is missing types
      url
    )
    if (!width || !height)
      throw new Error(`Could not get image size for ${url}`)
    return { width, height, url: path }
  }

  protected async imagesAttrs(
    urls?: string[]
  ): Promise<Prisma.ImageCreateInput[] | undefined> {
    if (!urls) return undefined
    const inputs = await Promise.all(urls.map(this.imageAttrs))
    return inputs.filter((i): i is Prisma.ImageCreateInput => !!i)
  }
}

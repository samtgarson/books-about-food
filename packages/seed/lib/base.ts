import { parseFile, Row } from '@fast-csv/parse'
import path from 'path'

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
}

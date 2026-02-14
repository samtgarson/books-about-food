import neatCsv, { Row } from 'neat-csv'
import { AppError } from 'src/core/services/utils/errors'

export async function parse(csv: string) {
  const headers = csv.split('\n')[0].split(',')
  if (headers.indexOf('Title') === -1) {
    throw new AppError(
      'InvalidInput',
      'CSV must have a header row with a Title column'
    )
  }

  let rows: Row[]
  try {
    rows = await neatCsv(csv)
  } catch (error) {
    throw new AppError('InvalidInput', `CSV is invalid: ${error}`)
  }

  return rows
}

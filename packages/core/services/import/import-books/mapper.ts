import prisma from '@books-about-food/database'
import { slugify } from '@books-about-food/shared/utils/slugify'
import { Row } from 'neat-csv'
import { ResultRow } from './types'

export const basicColumnMap: Record<
  string,
  (row: Row) => Partial<ResultRow['bookAttrs']>
> = {
  Title: (row) => ({
    title: row.Title.trim(),
    slug: slugify(row.Title)
  }),
  Subtitle: (row) => ({ subtitle: row.Subtitle.trim() }),
  'Date Published': (row) => ({ releaseDate: row['Date Published'] }),
  Pages: (row) => ({ pages: row.Pages ? parseInt(row.Pages) : undefined }),
  Cuisine: (row) => ({
    tags: row.Cuisine ? row.Cuisine.split(',').map((c) => c.trim()) : []
  }),
  Publisher: (row) => ({ publisher: row.Publisher.trim() })
}

export const isBasicAttr = (key: string): key is keyof typeof basicColumnMap =>
  key in basicColumnMap

export async function mapper(
  jobs: string[],
  row: Row,
  result: ResultRow,
  key: string
): Promise<ResultRow> {
  if (!row[key].length) return result
  const normalisedKey = key.replace(/ [0-9]+$/, '')
  if (!jobs.includes(normalisedKey)) return result
  const name = row[key].trim()

  if (normalisedKey === 'Author') {
    const found = await prisma.profile.findMany({
      where: { name: { equals: name, mode: 'insensitive' } }
    })
    const error = found.length > 1 ? 'MultipleMatches' : undefined
    result.authors.push({ name, id: found[0].id, error })
    return result
  }

  const found = await prisma.profile.findMany({
    where: { name: { equals: name, mode: 'insensitive' } }
  })
  const error = found.length > 1 ? 'MultipleMatches' : undefined
  result.contributors.push({
    job: normalisedKey,
    name,
    id: found[0].id,
    error
  })

  return result
}

export async function extractBookAttrs(
  original: Row
): Promise<ResultRow['bookAttrs']> {
  const keys = Object.keys(original)
  return keys.reduce(
    (attrs, key) => {
      if (isBasicAttr(key)) {
        const mappedKey = basicColumnMap[key]
        attrs = { ...attrs, ...mappedKey(original) }
      }

      return attrs
    },
    {} as ResultRow['bookAttrs']
  )
}

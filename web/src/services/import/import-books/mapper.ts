import prisma from 'database'
import { Row } from 'neat-csv'
import { slugify } from 'shared/utils/slugify'
import { ResultRow } from './types'

export const basicColumnMap: Record<
  string,
  (row: Row) => Partial<ResultRow['bookAttrs']>
> = {
  Title: (row) => ({
    title: row.Title.trim(),
    slug: slugify(row.Title).trim()
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
  const slug = slugify(name)

  if (normalisedKey === 'Author') {
    const found = await prisma.profile.findUnique({ where: { slug } })
    result.authors.push({ name, new: !found })
    return result
  }

  const found = await prisma.profile.findUnique({ where: { slug } })
  result.contributors.push({ job: normalisedKey, name, new: !found })

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

import { Hsl } from '@books-about-food/shared/utils/types'
import { Book } from 'src/core/models/book'
import { Book as PayloadBook } from 'src/payload/payload-types'
import { z } from 'zod'
import type { AuthorsMap, BookRow, ContributionsMap, PaletteMap } from './types'

export function transformToBook(
  row: BookRow,
  authorsMap: AuthorsMap,
  contributionsMap: ContributionsMap,
  paletteMap: PaletteMap
): Book {
  // Get related data for this book
  const authors = authorsMap.get(row.id) || []
  const contributions = contributionsMap.get(row.id) || []
  const palette = paletteMap.get(row.id) || []

  // Transform the raw database row to PayloadBook
  const bookData: PayloadBook = {
    ...row,
    backgroundColor: toHsl(row.backgroundColor),
    authors,
    contributions,
    palette
  }

  return new Book(bookData)
}

function toHsl(color: unknown) {
  return z
    .object({ h: z.number(), s: z.number(), l: z.number() })
    .parse(color) as Hsl
}

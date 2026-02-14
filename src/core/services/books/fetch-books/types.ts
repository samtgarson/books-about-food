import { BasePayload } from 'payload'
import { enum_books_status } from 'src/payload/schema'
import { z } from 'zod'
import { array, arrayOrSingle, paginationInput } from '../../utils/inputs'
import { NamedColor } from '../colors'
import { FetchBooksPageFilters, fetchBooksPageFilterValues } from '../filters'
import { selectBooks } from './query-builder'
import {
  fetchAuthorsForBooks,
  fetchContributionsForBooks,
  fetchPaletteForBooks
} from './related-data'

export type Drizzle = (typeof BasePayload)['prototype']['db']['drizzle']
export type BookRow = Awaited<ReturnType<typeof selectBooks>>[0]
export type AuthorsMap = Awaited<ReturnType<typeof fetchAuthorsForBooks>>
export type ContributionsMap = Awaited<
  ReturnType<typeof fetchContributionsForBooks>
>
export type PaletteMap = Awaited<ReturnType<typeof fetchPaletteForBooks>>

export const validator = z.object({
  sort: z
    .enum(['releaseDate', 'createdAt', 'title', 'color', 'random'])
    .optional(),
  tags: array(z.string()).optional(),
  search: z.string().optional(),
  profile: z.string().optional(),
  status: arrayOrSingle(z.enum(enum_books_status.enumValues)).optional(),
  submitterId: z.string().optional(),
  publisherSlug: z.string().optional(),
  color: z.enum(NamedColor).or(array(z.coerce.number())).optional(),
  releaseYear: z.number().optional(),
  pageCount: z
    .custom<FetchBooksPageFilters>((key) => {
      return fetchBooksPageFilterValues.includes(key as FetchBooksPageFilters)
    })
    .optional(),
  ...paginationInput.shape
})

export type FetchBooksInput = z.output<typeof validator>
export type BookSort = FetchBooksInput['sort']

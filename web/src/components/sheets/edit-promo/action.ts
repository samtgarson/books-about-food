'use server'

import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { BookLibrarySearchResult } from '@books-about-food/core/services/books/library/search-library'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { upsertPromoSchema } from '@books-about-food/core/services/publishers/schemas/upsert-promo'
import { upsertPromo } from '@books-about-food/core/services/publishers/upsert-promo'
import { revalidatePath } from 'next/cache'
import { parseAppError } from 'src/components/form/utils'
import { call } from 'src/utils/service'
import { Stringified, stringify } from 'src/utils/superjson'
import { z } from 'zod'

export async function fetchOptions(
  publisherSlug: string,
  search: string
): Promise<Stringified<BookLibrarySearchResult[]>> {
  const books = await call(fetchBooks, {
    publisherSlug,
    search
  })

  if (!books.success) return stringify([])

  return stringify(books.data.books.map(bookToResult))
}

export async function action(input: z.infer<typeof upsertPromoSchema>) {
  const res = await call(upsertPromo, input)
  if (res.success) return revalidatePath(`/publishers/${input.publisherSlug}`)

  return parseAppError(res.errors)
}

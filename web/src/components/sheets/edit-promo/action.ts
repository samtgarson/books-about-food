'use server'

import { BookResult } from '@books-about-food/core/models/types'
import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { clearPromo } from '@books-about-food/core/services/publishers/clear-promo'
import { upsertPromoSchema } from '@books-about-food/core/services/publishers/schemas/upsert-promo'
import { upsertPromo } from '@books-about-food/core/services/publishers/upsert-promo'
import { revalidatePath } from 'next/cache'
import { parseAppError } from 'src/components/form/utils'
import { call, parseAndCall } from 'src/utils/service'
import { Stringified, stringify } from 'src/utils/superjson'
import { z } from 'zod'

export async function fetchOptions(
  publisherSlug: string,
  search: string
): Promise<Stringified<BookResult[]>> {
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

export async function clear(data: FormData) {
  const res = await parseAndCall(clearPromo, Object.fromEntries(data.entries()))
  if (res.success)
    return revalidatePath(`/publishers/${res.data.publisher.slug}`)

  return parseAppError(res.errors)
}

'use server'

import { BookResult } from '@books-about-food/core/models/types'
import { fetchBooks } from '@books-about-food/core/services/books/fetch-books'
import { bookToResult } from '@books-about-food/core/services/books/utils/to-result'
import { archiveCollection } from '@books-about-food/core/services/collections/archive-collection'
import { upsertCollectionSchema } from '@books-about-food/core/services/collections/schemas/upsert-collection'
import { upsertCollection } from '@books-about-food/core/services/collections/upsert-collection'
import { revalidatePath } from 'next/cache'
import { parseAppError } from 'src/components/form/utils'
import { call } from 'src/utils/service'
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

export async function action(input: z.infer<typeof upsertCollectionSchema>) {
  const res = await call(upsertCollection, input)
  if (res.success) return revalidatePath(`/publishers/${input.publisherSlug}`)

  return parseAppError(res.errors)
}

export async function clear(data: FormData, publisherSlug: string) {
  const res = await call(archiveCollection, Object.fromEntries(data.entries()))
  if (res.success) return revalidatePath(`/publishers/${publisherSlug}`)

  return parseAppError(res.errors)
}

'use server'

import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { createBook } from 'src/services/books/create-book'
import { searchLibrary } from 'src/services/books/library/search-library'
import { stringify } from 'src/utils/superjson'

export const action: FormAction = async (values: unknown) => {
  const book = await createBook.parseAndCall(values)

  redirect(`/edit/${book.slug}`)
}

export const search = async (query: string) => {
  if (query.length < 3) return stringify([])
  return stringify(await searchLibrary.call({ query }))
}

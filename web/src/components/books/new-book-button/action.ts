'use server'

import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { createBook } from 'src/services/books/create-book'
import { searchLibrary } from 'src/services/books/library/search-library'
import { stringify } from 'src/utils/superjson'

export const action: FormAction = async (values: unknown) => {
  const result = await createBook.parseAndCall(values)

  if (result.data) redirect(`/edit/${result.data.slug}`)
  switch (result.error.type) {
    case 'UniqueConstraintViolation':
      return { title: { message: 'A book with this title already exists' } }
    default:
      return { title: { message: 'An unknown error occurred' } }
  }
}

export const search = async (query: string) => {
  if (query.length < 3) return stringify([])
  const result = await searchLibrary.call({ query })
  if (result.success && result.data) return stringify(result.data)
  return stringify([])
}

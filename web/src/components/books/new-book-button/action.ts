'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { parseAppError } from 'src/components/form/utils'
import { createBook } from 'src/services/books/create-book'
import { searchLibrary } from 'src/services/books/library/search-library'
import { stringify } from 'src/utils/superjson'

export const action: FormAction = async (values: unknown) => {
  const result = await createBook.parseAndCall(values)

  if (result.success) redirect(`/edit/${result.data.slug}`)
  console.log(result.errors)
  return parseAppError(
    result.errors,
    {
      title: {
        UniqueConstraintViolation: 'A book with this title already exists'
      }
    },
    { slug: 'title' }
  )
}

export const search = async (query: string) => {
  if (query.length < 3) return stringify([])
  const result = await searchLibrary.call({ query })
  if (!result.success) return stringify([])

  revalidatePath('/account/books')
  return stringify(result.data)
}

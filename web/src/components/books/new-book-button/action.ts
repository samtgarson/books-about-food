'use server'

import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { createBook } from 'src/services/books/create-book'
import { callWithUser } from 'src/utils/call-with-user'

export const action: FormAction = async (values: unknown) => {
  const book = await callWithUser(createBook, values)

  redirect(`/edit/${book.slug}`)
}

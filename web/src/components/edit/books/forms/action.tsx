import { updateBook } from '@books-about-food/core/services/books/update-book'
import { revalidatePath } from 'next/cache'
import { parseAndCall } from 'src/utils/service'

export const createAction = (slug: string) => async (data: unknown) => {
  'use server'

  const { success } = await parseAndCall(updateBook, {
    slug,
    ...(data as object)
  })

  revalidatePath('/edit/:slug')
  return success
}

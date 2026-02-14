import { revalidatePath } from 'next/cache'
import { updateBook } from 'src/core/services/books/update-book'
import { call } from 'src/utils/service'

export const createAction = (slug: string) => async (data: unknown) => {
  'use server'

  const { success } = await call(updateBook, {
    slug,
    ...(data as object)
  })

  revalidatePath('/edit/:slug')
  return success
}

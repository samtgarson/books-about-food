import { updateBook } from '@books-about-food/core/services/books/update-book'
import { revalidatePath } from 'next/cache'
import { parseAndCall } from 'src/utils/service'

export const createAction =
  (slug: string) => async (data: Record<string, unknown>) => {
    'use server'

    const { success } = await parseAndCall(updateBook, { slug, ...data })

    revalidatePath('/edit/:slug')
    return success
  }

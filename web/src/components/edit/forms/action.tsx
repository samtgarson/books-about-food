import { updateBook } from '@books-about-food/core/services/books/update-book'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { parseAndCall } from 'src/utils/service'

export const createAction =
  (slug: string): FormAction =>
  async (data) => {
    'use server'

    const { data: result } = await parseAndCall(updateBook, { slug, ...data })
    if (!result) return

    const path = `/edit/${result.slug}?action=saved`
    revalidatePath(path)
    redirect(path)
  }

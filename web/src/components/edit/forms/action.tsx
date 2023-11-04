import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { updateBook } from 'src/services/books/update-book'

export const createAction =
  (slug: string): FormAction =>
  async (data) => {
    'use server'

    const { data: result } = await updateBook.parseAndCall({ slug, ...data })
    if (!result) return

    const path = `/edit/${result.slug}?action=saved`
    revalidatePath(path)
    redirect(path)
  }

import { updateBook } from 'core/services/books/update-book'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'

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

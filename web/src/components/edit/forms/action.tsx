import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { updateBook } from 'src/services/books/update-book'
import { callWithUser } from 'src/utils/call-with-user'

export const createAction =
  (slug: string): FormAction =>
    async (data) => {
      'use server'

      const result = await callWithUser(updateBook, { slug, ...data })
      const path = `/edit/${result.slug}`
      revalidatePath(path)
      redirect(path)
    }

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { FormAction } from 'src/components/form'
import { getUser } from 'src/services/auth/get-user'
import { updateBook } from 'src/services/books/update-book'

export const createAction =
  (slug: string): FormAction =>
    async (data) => {
      'use server'

      const user = await getUser.call()
      if (!user) return notFound()
      const result = await updateBook.parseAndCall({ slug, ...data }, user)

      const path = `/edit/${result.slug}`
      revalidatePath(path)
      redirect(path)
    }

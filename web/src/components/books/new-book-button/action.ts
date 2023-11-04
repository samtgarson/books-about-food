'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { parseAppError } from 'src/components/form/utils'
import { searchLibrary } from 'src/services/books/library/search-library'
import { updateBook } from 'src/services/books/update-book'
import { array } from 'src/services/utils/inputs'
import { createImage } from 'src/services/utils/resources'
import { stringify } from 'src/utils/superjson'
import z from 'zod'

const actionSchema = z.object({
  title: z.string(),
  googleBooksId: z.string().optional(),
  subtitle: z.string().optional(),
  authorIds: array(z.string()).optional(),
  tags: array(z.string()).optional(),
  cover: z.string().optional()
})

export const action = async (values: unknown) => {
  const { cover, ...data } = actionSchema.parse(values)
  const coverImageId = await createImage(cover)
  const result = await updateBook.call({ ...data, coverImageId })

  if (result.success) redirect(`/edit/${result.data.slug}`)
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

  revalidatePath('/account/submissions')
  return stringify(result.data)
}

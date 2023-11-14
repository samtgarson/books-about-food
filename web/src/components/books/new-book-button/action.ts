'use server'

import { searchLibrary } from '@books-about-food/core/services/books/library/search-library'
import { updateBook } from '@books-about-food/core/services/books/update-book'
import { array } from '@books-about-food/core/services/utils/inputs'
import { createCoverFromUrl } from '@books-about-food/core/services/utils/resources'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { parseAppError } from 'src/components/form/utils'
import { call } from 'src/utils/service'
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
  const coverImageId = await createCoverFromUrl(cover)
  const result = await call(updateBook, { ...data, coverImageId })

  if (result.success) redirect(`/edit/${result.data.slug}?action=created`)
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
  const result = await call(searchLibrary, { query })
  if (!result.success) return stringify([])

  revalidatePath('/account/submissions')
  return stringify(result.data)
}

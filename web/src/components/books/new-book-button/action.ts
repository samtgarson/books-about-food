'use server'

import { searchLibrary } from '@books-about-food/core/services/books/library/search-library'
import { updateBook } from '@books-about-food/core/services/books/update-book'
import { createImages } from '@books-about-food/core/services/images/create-images'
import { array } from '@books-about-food/core/services/utils/inputs'
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
  const id = crypto.randomUUID()
  let coverImageId: string | undefined
  if (cover) {
    const imageRes = await call(createImages, {
      prefix: `books/${id}/cover`,
      files: [{ url: cover }]
    })
    if (imageRes.success) coverImageId = imageRes.data[0].id
  }

  const result = await call(updateBook, { ...data, id, coverImageId })

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

  return stringify(result.data)
}

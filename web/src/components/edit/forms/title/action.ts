'use server'

import { Profile } from '@books-about-food/core/models/profile'
import { fetchLibraryBook } from '@books-about-food/core/services/books/library/fetch-library-book'
import { findOrCreateAuthor } from '@books-about-food/core/services/utils/resources'
import { call } from 'src/utils/service'
import { Stringified, stringify } from 'src/utils/superjson'
import { TitleFormContentProps } from './form-content'

export type TitleSelectChangeAttrs = TitleFormContentProps & {
  authors?: Profile[]
  googleBooksId?: string
  cover?: string
}

export const fetchAttrs = async (
  id: string
): Promise<undefined | Stringified<TitleSelectChangeAttrs>> => {
  const result = await call(fetchLibraryBook, { id })
  if (!result.success || !result.data) return
  const { id: googleBooksId, ...data } = result.data

  const authors = (
    await Promise.all(result.data.authors.map(findOrCreateAuthor))
  ).filter((id): id is Profile => !!id)

  return stringify({ ...data, googleBooksId, authors })
}

'use server'

import { Profile } from '@books-about-food/core/models/profile'
import { fetchLibraryBook } from '@books-about-food/core/services/books/library/fetch-library-book'
import { findOrCreateProfile } from '@books-about-food/core/services/profiles/find-or-create-profile'
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
    await Promise.all(
      result.data.authors.map(async function (name) {
        const { data } = await call(findOrCreateProfile, { name })
        return data
      })
    )
  ).filter((profile): profile is Profile => !!profile)

  return stringify({ ...data, googleBooksId, authors })
}

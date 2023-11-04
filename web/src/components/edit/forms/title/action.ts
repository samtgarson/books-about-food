'use server'

import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { Profile } from 'src/models/profile'
import { fetchLibraryBook } from 'src/services/books/library/fetch-library-book'
import { profileIncludes } from 'src/services/utils'
import { findOrCreateAuthor } from 'src/services/utils/resources'
import { Stringified, stringify } from 'src/utils/superjson'
import { TitleFormContentProps } from './form-content'

export async function createProfile(name: string) {
  const profile = await prisma.profile.create({
    data: { name, slug: slugify(name) },
    include: profileIncludes
  })
  return profile
}

export type TitleSelectChangeAttrs = TitleFormContentProps & {
  authors?: Profile[]
  googleBooksId?: string
  cover?: string
}

export const fetchAttrs = async (
  id: string
): Promise<undefined | Stringified<TitleSelectChangeAttrs>> => {
  const result = await fetchLibraryBook.call({ id })
  if (!result.success || !result.data) return
  const { id: googleBooksId, ...data } = result.data

  const authors = (
    await Promise.all(result.data.authors.map(findOrCreateAuthor))
  ).filter((id): id is Profile => !!id)

  return stringify({ ...data, googleBooksId, authors })
}

'use server'

import { Profile } from 'core/models/profile'
import { fetchLibraryBook } from 'core/services/books/library/fetch-library-book'
import { profileIncludes } from 'core/services/utils'
import { findOrCreateAuthor } from 'core/services/utils/resources'
import prisma from 'database'
import { slugify } from 'shared/utils/slugify'
import { call } from 'src/utils/service'
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
  const result = await call(fetchLibraryBook, { id })
  if (!result.success || !result.data) return
  const { id: googleBooksId, ...data } = result.data

  const authors = (
    await Promise.all(result.data.authors.map(findOrCreateAuthor))
  ).filter((id): id is Profile => !!id)

  return stringify({ ...data, googleBooksId, authors })
}

'use server'

import { fetchFrequentCollaborators } from 'src/services/books/fetch-frequent-collaborators'
import { stringify } from 'src/utils/superjson'

export const fetch = async (slug: string) =>
  stringify(await fetchFrequentCollaborators.call({ slug }))

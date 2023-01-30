/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextApiHandler } from 'next'
import { z } from 'zod'
import { fetchBook } from 'src/services/books/fetch-book'
import { fetchBooks } from 'src/services/books/fetch-books'
import { fetchProfiles } from 'src/services/profiles/fetch-profiles'
import { fetchPublishers } from 'src/services/publishers/fetch-publishers'
import superjson from 'superjson'
import 'src/utils/superjson'
import { fetchTags } from 'src/services/tags/fetch'
import { fetchJobs } from 'src/services/jobs/fetch-jobs'
import { getUser } from 'src/services/auth/get-user'
import { fetchFavourite } from 'src/services/favourites/fetch-favourite'
import { updateFavourite } from 'src/services/favourites/update-favourite'
import { Service } from 'src/utils/service'

export const fetchMap = {
  books: fetchBooks,
  book: fetchBook,
  profiles: fetchProfiles,
  publishers: fetchPublishers,
  tags: fetchTags,
  jobs: fetchJobs,
  favourite: fetchFavourite
} as const

export const mutateMap = {
  favourite: updateFavourite
} as const

export type FetchMap = typeof fetchMap
export type MutateMap = typeof mutateMap
export type FetchKey = keyof FetchMap
export type MutateKey = keyof MutateMap

export type FunctionArgs<Map, Key extends keyof Map> = z.infer<
  Map[Key] extends Service<infer I, any> ? I : never
>
export type FunctionReturn<
  Map,
  Key extends keyof Map
> = Map[Key] extends Service<any, infer R> ? R : never

const handler: NextApiHandler = async (req, res) => {
  const isFetch = req.method === 'GET'
  const map = isFetch ? fetchMap : mutateMap
  const { fn, input } = req.query as { fn: keyof typeof map; input?: string }
  const service = map[fn as keyof typeof map]

  if (!service) {
    res.status(404).end()
    return
  }

  const user = await getUser.call({ req })

  try {
    const parsed = input && superjson.parse(input)
    const data = await service.parseAndCall(parsed, user)
    const serialized = superjson.serialize(data)

    if (isFetch) {
      const { maxAge = 60, staleFor = 604800 } = service.requestMeta
      res.setHeader(
        'Cache-Control',
        `s-maxage=${maxAge}, stale-while-revalidate=${staleFor}`
      )
    }
    res.status(200).json(serialized)
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

export default handler

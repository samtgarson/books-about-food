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
import { fetchClaim } from 'src/services/claims/fetch-claim'
import { createClaim } from 'src/services/claims/create-claim'
import { destroyClaim } from 'src/services/claims/destroy-claim'
import { RequestException } from 'src/contexts/fetcher/exceptions'

type Map = {
  [key: string]: Service<any, any>
}

export const fetchMap = {
  books: fetchBooks,
  book: fetchBook,
  profiles: fetchProfiles,
  publishers: fetchPublishers,
  tags: fetchTags,
  jobs: fetchJobs,
  favourite: fetchFavourite,
  claim: fetchClaim
} as const satisfies Map

export const mutateMap = {
  favourite: updateFavourite,
  claim: createClaim
} as const satisfies Map

export const destroyMap = {
  claim: destroyClaim
} as const satisfies Map

export type FetchMap = typeof fetchMap
export type MutateMap = typeof mutateMap
export type DestroyMap = typeof destroyMap
export type FetchKey = keyof FetchMap
export type MutateKey = Extract<FetchKey, keyof MutateMap>
export type DestroyKey = Extract<FetchKey, keyof DestroyMap>

export type FunctionArgs<Map, Key extends keyof Map> = z.infer<
  Map[Key] extends Service<infer I, any> ? I : never
>
export type FunctionReturn<
  Map,
  Key extends keyof Map
> = Map[Key] extends Service<any, infer R> ? R : never

function mapFor(method: string | undefined) {
  if (!method) return fetchMap
  switch (method) {
    case 'GET':
      return fetchMap
    case 'DELETE':
      return destroyMap
    default:
      return mutateMap
  }
}

const handler: NextApiHandler = async (req, res) => {
  const map = mapFor(req.method)
  const { fn, input } = req.query as { fn: keyof typeof map; input?: string }
  const service = map[fn as keyof typeof map]

  if (!service || !map) {
    res.status(404).end()
    return
  }

  const user = await getUser.call({ req, res })
  const { authorized, cache: { maxAge = 60, staleFor = 604800 } = {} } =
    service.requestMeta

  if (authorized && !user) {
    return res.status(401).end()
  }

  try {
    const parsed = input && superjson.parse(input)
    const data = await service.parseAndCall(parsed, user)
    const serialized = superjson.serialize(data)

    if (req.method === 'GET') {
      res.setHeader(
        'Cache-Control',
        `s-maxage=${maxAge}, stale-while-revalidate=${staleFor}`
      )
      res.status(200).json(serialized)
    } else if (req.method === 'POST') {
      res.status(201).json(serialized)
    } else if (req.method === 'DELETE') {
      res.status(204).end()
    }
  } catch (error) {
    console.error(error)
    if (error instanceof RequestException) {
      return res.status(error.status).end()
    }
    res.status(500).end()
  }
}

export default handler

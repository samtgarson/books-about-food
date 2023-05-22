/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextApiHandler } from 'next'
import { RequestException } from 'src/contexts/fetcher/exceptions'
import { getUser } from 'src/services/auth/get-user'
import { fetchMap, destroyMap, mutateMap } from 'src/services/map'
import 'src/utils/superjson'
import superjson from 'superjson'

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

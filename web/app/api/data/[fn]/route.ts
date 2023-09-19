import { NextRequest, NextResponse } from 'next/server'
import { RequestException } from 'src/contexts/fetcher/exceptions'
import { getUser } from 'src/services/auth/get-user'
import { destroyMap, fetchMap, mutateMap } from 'src/services/map'
import 'src/utils/superjson'
import superjson from 'superjson'

type Map = typeof fetchMap | typeof mutateMap | typeof destroyMap
type Params<M extends Map = Map> = { fn: keyof M }
type Handler = (
  req: NextRequest,
  ctx: { params: Params }
) => ReturnType<typeof handler>

const handler = async (
  req: NextRequest,
  map: Map,
  { fn }: Params<typeof map>
) => {
  const input = req.nextUrl.searchParams.get('input')
  const service = map[fn as keyof typeof map]
  const user = await getUser.call()

  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { authorized, cache: { maxAge = 60, staleFor = 604800 } = {} } =
    service.requestMeta

  if (authorized && !user) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const parsed = input && superjson.parse(input)
    const data = await service.parseAndCall(parsed, user)
    const serialized = superjson.serialize(data)

    if (req.method === 'GET') {
      return NextResponse.json(serialized, {
        headers: {
          'Cache-Control': `s-maxage=${maxAge}, stale-while-revalidate=${staleFor}`
        },
        status: 200
      })
    } else if (req.method === 'POST') {
      return NextResponse.json(serialized, { status: 201 })
    } else {
      return NextResponse.json(null, { status: 204 })
    }
  } catch (error) {
    console.error('DATA ERROR', error)
    if (error instanceof RequestException && error.status) {
      return NextResponse.json(null, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET: Handler = (req, { params }) => handler(req, fetchMap, params)
export const POST: Handler = (req, { params }) =>
  handler(req, mutateMap, params)
export const DELETE: Handler = (req, { params }) =>
  handler(req, destroyMap, params)

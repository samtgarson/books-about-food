import { NextAuthRequest } from 'next-auth/lib'
import { NextResponse } from 'next/server'
import { auth } from 'src/auth'
import { RequestException } from 'src/contexts/fetcher/exceptions'
import { destroyMap, fetchMap, mutateMap } from 'src/services/map'
import 'src/utils/superjson'
import superjson from 'superjson'

const handler = async (
  req: NextAuthRequest,
  map: typeof fetchMap | typeof mutateMap | typeof destroyMap
) => {
  const fn = req.nextUrl.searchParams.get('fn')
  const input = req.nextUrl.searchParams.get('input')
  const service = map[fn as keyof typeof map]

  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { cache: { maxAge = 60, staleFor = 604800 } = {} } = service.requestMeta

  try {
    const parsed = input && superjson.parse(input)
    const data = await service.parseAndCall(parsed, req.auth.user)
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
    console.error(error)
    if (error instanceof RequestException) {
      return NextResponse.json(null, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = auth((req) => handler(req, fetchMap))
export const POST = auth((req) => handler(req, mutateMap))
export const DELETE = auth((req) => handler(req, destroyMap))

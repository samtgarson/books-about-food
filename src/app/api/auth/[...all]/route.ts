import { toNextJsHandler } from 'better-auth/next-js'
import { getAuth } from 'src/auth'

export async function POST(request: Request) {
  const auth = await getAuth()
  return toNextJsHandler(auth).POST(request)
}

export async function GET(request: Request) {
  const auth = await getAuth()
  return toNextJsHandler(auth).GET(request)
}

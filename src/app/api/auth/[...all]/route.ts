import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from 'src/auth'

export const { POST, GET } = toNextJsHandler(auth)

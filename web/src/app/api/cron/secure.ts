import { getEnv } from '@books-about-food/shared/utils/get-env'
import { NextRequest, NextResponse } from 'next/server'

const secret = getEnv('CRON_SECRET')

export function secure(fn: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const [type, token] = req.headers.get('Authorization')?.split(' ') ?? []
    if (token !== secret || type !== 'Bearer') {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    return fn(req)
  }
}

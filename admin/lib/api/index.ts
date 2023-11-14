import { bodyParser } from '@koa/bodyparser'
import Router from '@koa/router'
import { inngest } from 'core/gateways/inngest'
import { functions } from 'core/gateways/inngest/functions'
import prisma from 'database'
import { serve } from 'inngest/koa'
import jwt from 'koa-jwt'
import { logger } from 'lib/utils/logger'
import { websites } from 'shared/data/websites'

const secret = process.env.FOREST_AUTH_SECRET
if (!secret) throw new Error('Missing FOREST_AUTH_SECRET')

export const apiRouter = new Router({ prefix: '/api' })
apiRouter.use(logger)
apiRouter.use(bodyParser())

const serveHost =
  process.env.NODE_ENV === 'production'
    ? 'https://admin.booksaboutfood.info'
    : 'http://localhost:5001'
const handler = serve({ client: inngest, functions, serveHost })
apiRouter.all('/inngest', (ctx) => {
  console.log('inngest', ctx.request.url)
  return handler(ctx)
})

apiRouter.use(jwt({ secret }))

apiRouter.get('/tags', async (ctx) => {
  const tags = await prisma.tag.findMany()
  ctx.body = { data: tags.map((t) => t.name) }
})

apiRouter.get('/link-sites', async (ctx) => {
  ctx.body = {
    data: [...websites, 'Other']
  }
})

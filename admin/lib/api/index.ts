import Router from '@koa/router'
import prisma from 'database'
import jwt from 'koa-jwt'
import { logger } from 'lib/utils/logger'
import { websites } from 'shared/data/websites'

const secret = process.env.FOREST_AUTH_SECRET
if (!secret) throw new Error('Missing FOREST_AUTH_SECRET')

export const apiRouter = new Router({ prefix: '/api' })
apiRouter.use(logger)
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

import prisma from '@books-about-food/database'
import { inngest } from '@books-about-food/jobs'
import { functions } from '@books-about-food/jobs/functions'
import { websites } from '@books-about-food/shared/data/websites'
import { bodyParser } from '@koa/bodyparser'
import Router from '@koa/router'
import { serve } from 'inngest/koa'
import jwt from 'koa-jwt'
import { logger } from 'lib/utils/logger'

const secret = process.env.FOREST_AUTH_SECRET
if (!secret) throw new Error('Missing FOREST_AUTH_SECRET')
const serveHost =
  process.env.NODE_ENV === 'production'
    ? 'https://admin.booksaboutfood.info'
    : 'http://localhost:5001'

export const apiRouter = new Router({ prefix: '/api' })
apiRouter.use(logger)
apiRouter.use(bodyParser())

apiRouter.all('/inngest', serve({ client: inngest, functions, serveHost }))

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

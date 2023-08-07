import Router from '@koa/router'
import prisma from 'database'
import jwt from 'koa-jwt'
import { logger } from 'lib/utils/logger'

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
  const sites = await prisma.link.findMany({
    select: { site: true },
    distinct: ['site']
  })
  const defaultLinkSites = [
    'Amazon',
    'Edelweiss+',
    'Bookshop.org',
    'Worldcat',
    'AbeBooks'
  ]
  ctx.body = {
    data: Array.from(
      new Set([...defaultLinkSites, ...sites.map((s) => s.site), 'Other'])
    )
  }
})

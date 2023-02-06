import type Router from '@koa/router'

export const logger: Router.Middleware = async (ctx, next) => {
  const start = Date.now()
  try {
    await next()
  } catch (err) {
    if (ctx.status === 500) console.error(err)
  }

  const ms = Date.now() - start
  console.log(`[${ctx.status}] ${ctx.method} ${ctx.url} - ${ms}ms`)
}

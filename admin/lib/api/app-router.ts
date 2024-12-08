import { UserRole } from '@books-about-food/database'
import Router from '@koa/router'
import { DefaultState } from 'koa'
import { edelweissImport } from 'lib/services/edelweiss-import'
import { z } from 'zod'

const authSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish().default(null),
  role: z.nativeEnum(UserRole).default('user'),
  image: z.string().nullish().default(null),
  publishers: z.array(z.string()).default([])
})
export const appRouter = new Router<
  DefaultState,
  { user: z.infer<typeof authSchema> }
>()
appRouter.use(async function (ctx, next) {
  const parsed = authSchema.safeParse(ctx.state.user)
  if (!parsed.success) {
    ctx.status = 401
    return
  }

  ctx.user = parsed.data
  return next()
})

appRouter.post('/edelweiss-import', async (ctx) => {
  const parsed = edelweissImport.input.safeParse(ctx.request.body)
  if (!parsed.success) {
    ctx.status = 400
    ctx.body = parsed.error.flatten()
    return
  }

  const res = await edelweissImport.call(parsed.data, ctx.user)
  if (!res.success) {
    ctx.status = 500
    ctx.body = res.errors
    return
  }

  ctx.body = res.data
})

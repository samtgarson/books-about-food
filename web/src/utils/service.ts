/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthedService,
  Service,
  ServiceResult
} from '@books-about-food/core/services/base'
import { AppError } from '@books-about-food/core/services/utils/errors'
import prisma from '@books-about-food/database'
import { cache } from 'react'
import { auth } from 'src/auth'
import z from 'zod'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
}

export const getUser = cache(async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  } catch (e) {
    console.error(e)
    return null
  }
})

type ServiceClass<I extends z.ZodTypeAny, R> =
  | Service<I, R>
  | AuthedService<I, R>

export const call = cache(async function <S extends ServiceClass<any, any>>(
  service: S,
  args?: S extends ServiceClass<infer I, any> ? z.infer<I> : never
) {
  if (service.authed) {
    const user = await getUser()
    if (!user)
      return {
        success: false,
        errors: [
          new AppError(
            'Unauthorized',
            'Not authorized to perform this action'
          ).toJSON()
        ]
      } as S extends ServiceClass<any, infer R> ? ServiceResult<R> : never
    return service.call(args, user) as Promise<
      S extends ServiceClass<any, infer R> ? ServiceResult<R> : never
    >
  }

  return service.call(args) as Promise<
    S extends ServiceClass<any, infer R> ? ServiceResult<R> : never
  >
})

export const parseAndCall = cache(async function <
  S extends ServiceClass<any, any>
>(service: S, args?: unknown) {
  try {
    const input = service.input.parse(args)
    return call(service, input) as Promise<
      S extends ServiceClass<any, infer R> ? ServiceResult<R> : never
    >
  } catch (e) {
    if (!(e instanceof z.ZodError)) {
      throw e
    }
    return {
      success: false,
      errors: e.issues.map((issue) =>
        new AppError(
          'InvalidInput',
          issue.message,
          issue.path.pop() as string
        ).toJSON()
      )
    } as S extends ServiceClass<any, infer R> ? ServiceResult<R> : never
  }
})

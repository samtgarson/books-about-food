/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthedService,
  Service,
  ServiceResult
} from '@books-about-food/core/services/base'
import { AppError } from '@books-about-food/core/services/utils/errors'
import { cache } from 'react'
import { parse, stringify } from 'superjson'
import z from 'zod'
import { getSessionUser } from './user'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
}

type ServiceClass<I extends z.ZodTypeAny, R> =
  | Service<I, R>
  | AuthedService<I, R>

export async function call<S extends ServiceClass<any, any>>(
  service: S,
  args?: S extends ServiceClass<infer I, any> ? z.infer<I> : never
) {
  const stringArgs = stringify(args)
  return cachedCall(service, stringArgs)
}

const cachedCall = cache(async function <S extends ServiceClass<any, any>>(
  service: S,
  stringArgs?: string
) {
  const args = stringArgs ? parse(stringArgs) : undefined
  if (service.authed) {
    const user = await getSessionUser()
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

export const parseAndCall = async function <S extends ServiceClass<any, any>>(
  service: S,
  args?: unknown
) {
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
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ServiceClass,
  ServiceInput,
  ServiceReturn
} from '@books-about-food/core/services/base'
import { AppError } from '@books-about-food/core/services/utils/errors'
import * as Sentry from '@sentry/nextjs'
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

class DeserializationError extends Error {}

export async function call<S extends ServiceClass<any, any>>(
  service: S,
  args?: ServiceInput<S>
) {
  const stringArgs = stringify(args)
  try {
    return await cachedCall(service, stringArgs)
  } catch (e) {
    if (e instanceof DeserializationError) return rawCall(service, args)
    throw e
  }
}

const cachedCall = cache(async function <S extends ServiceClass<any, any>>(
  service: S,
  stringArgs?: string
) {
  let args: ServiceInput<S> | undefined
  try {
    args = stringArgs ? (parse(stringArgs) as ServiceInput<S>) : undefined
  } catch (e) {
    throw new DeserializationError()
  }
  return rawCall(service, args)
})

async function rawCall<S extends ServiceClass<any, any>>(
  service: S,
  args?: ServiceInput<S>
) {
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
      } as ServiceReturn<S>
    return service.call(args, user) as Promise<ServiceReturn<S>>
  }

  return service.call(args) as Promise<ServiceReturn<S>>
}

export const parseAndCall = async function <S extends ServiceClass<any, any>>(
  service: S,
  args?: unknown
) {
  try {
    const input = service.input.parse(args)
    return call(service, input) as Promise<ServiceReturn<S>>
  } catch (e) {
    if (!(e instanceof z.ZodError)) {
      Sentry.captureException(e)
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
    } as ServiceReturn<S>
  }
}

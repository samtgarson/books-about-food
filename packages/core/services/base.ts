/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  AppErrorJSON
} from '@books-about-food/core/services/utils/errors'
import { User } from '@books-about-food/core/types'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'

export type RequestMeta = {
  cache?: string | { maxAge?: number; key: string }
  admin?: boolean
}

export type ServiceError = {
  success: false
  data?: never
  errors: AppErrorJSON[]
  originalError?: unknown
}

export type ServiceClass<I extends z.ZodType, R> =
  | Service<I, R>
  | AuthedService<I, R>

export type ServiceResult<T> =
  | {
      success: true
      data: T
      errors?: never
    }
  | ServiceError

export type ServiceReturn<
  S extends BaseService<any, any, any> | ServiceClass<any, any>
> =
  S extends BaseService<any, any, infer R>
    ? ServiceResult<R>
    : S extends ServiceClass<any, infer R>
      ? ServiceResult<R>
      : never

export type ServiceInput<
  S extends BaseService<any, any, any> | ServiceClass<any, any>
> =
  S extends BaseService<any, infer I, any>
    ? z.input<I>
    : S extends ServiceClass<infer I, any>
      ? z.input<I>
      : never

abstract class BaseService<
  Authed extends boolean,
  Input extends z.ZodType,
  Return
> {
  constructor(
    public authed: Authed,
    public input: Input,
    private _call: (
      ...args: Authed extends true
        ? [input: z.output<Input>, user: User]
        : [input: z.output<Input>, user?: never]
    ) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {}

  public async call(
    ...args: Authed extends true
      ? [input: z.input<Input>, user: User]
      : [input: z.input<Input>, user?: never]
  ): Promise<ServiceResult<Return>> {
    const user = args[1]
    try {
      const parsed = this.input.parse(args[0])
      return {
        success: true,
        // @ts-expect-error We have a zod input/output mismatch here that TS can't resolve
        data: await this._call(parsed, user)
      }
    } catch (e) {
      console.log('Service failure', e)
      if (isServiceError(e)) return e
      Sentry.captureException(e)
      return {
        success: false,
        errors: [AppError.fromError(e).toJSON()]
      }
    }
  }

  public get cacheKey() {
    if (typeof this.requestMeta.cache === 'string')
      return this.requestMeta.cache
    return this.requestMeta.cache?.key
  }

  public get defaultCacheMaxAge() {
    if (
      typeof this.requestMeta.cache === 'object' &&
      this.requestMeta.cache.maxAge
    )
      return this.requestMeta.cache.maxAge
  }
}

export class Service<Input extends z.ZodType, Return> extends BaseService<
  false,
  Input,
  Return
> {
  constructor(
    public input: Input,
    call: (input: z.output<Input>) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    super(false, input, call, requestMeta)
  }
}

export class AuthedService<Input extends z.ZodType, Return> extends BaseService<
  true,
  Input,
  Return
> {
  constructor(
    public input: Input,
    call: (input: z.output<Input>, user: User) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    super(true, input, call, requestMeta)
  }

  async call(
    input: z.input<Input>,
    user: User
  ): Promise<ServiceResult<Return>> {
    if (!user)
      return {
        success: false,
        errors: [
          {
            type: 'Unauthorized',
            message: 'This action requires authentication',
            status: 401
          }
        ]
      }
    if (this.requestMeta.admin && user.role !== 'admin')
      return {
        success: false,
        errors: [
          {
            type: 'Forbidden',
            message: 'You don\t have permission to perform this action',
            status: 403
          }
        ]
      }
    return super.call(input, user)
  }
}

function isServiceError(res: unknown): res is ServiceError {
  return (
    typeof res === 'object' &&
    res !== null &&
    'success' in res &&
    res.success === false
  )
}

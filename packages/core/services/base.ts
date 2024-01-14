/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  AppErrorJSON
} from '@books-about-food/core/services/utils/errors'
import { User } from '@books-about-food/database'
import { z } from 'zod'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
}

export type ServiceResult<T> =
  | {
      success: true
      data: T
      errors?: never
    }
  | {
      success: false
      data?: never
      errors: AppErrorJSON[]
      originalError?: unknown
    }

export type ServiceReturn<S extends BaseService<any, any, any>> =
  S extends BaseService<any, any, infer R> ? ServiceResult<R> : never

abstract class BaseService<
  Authed extends boolean,
  Input extends z.ZodTypeAny,
  Return
> {
  private _call: (
    ...args: Authed extends true
      ? [input: z.output<Input> | undefined, user: User]
      : [input: z.output<Input> | undefined, user?: never]
  ) => Promise<Return>

  constructor(
    public authed: Authed,
    public input: Input,
    call: (
      ...args: Authed extends true
        ? [input: z.output<Input> | undefined, user: User]
        : [input: z.output<Input> | undefined, user?: never]
    ) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    this._call = call
  }

  public async call(
    ...args: Authed extends true
      ? [input: z.input<Input> | undefined, user: User]
      : [input: z.input<Input> | undefined, user?: never]
  ): Promise<ServiceResult<Return>> {
    try {
      args[0] = this.input.optional().parse(args[0])
      return {
        success: true,
        data: await this._call(...args)
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        errors: [AppError.fromError(e).toJSON()]
      }
    }
  }
}

export class Service<Input extends z.ZodTypeAny, Return> extends BaseService<
  false,
  Input,
  Return
> {
  constructor(
    public input: Input,
    call: (input: z.output<Input> | undefined) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    super(false, input, call, requestMeta)
  }
}

export class AuthedService<
  Input extends z.ZodTypeAny,
  Return
> extends BaseService<true, Input, Return> {
  constructor(
    public input: Input,
    call: (input: z.output<Input> | undefined, user: User) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    super(true, input, call, requestMeta)
  }
}

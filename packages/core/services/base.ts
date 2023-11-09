/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError, AppErrorJSON } from 'core/services/utils/errors'
import { User } from 'database'
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

export type ServiceReturn<S extends Service<any, any>> = S extends Service<
  any,
  infer R
>
  ? ServiceResult<R>
  : never

export class Service<Input extends z.ZodTypeAny, Return> {
  private _call: (input?: z.infer<Input>, user?: User | null) => Promise<Return>
  constructor(
    public input: Input,
    call: (input?: z.infer<Input>, user?: User | null) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    this._call = call
  }

  public async parseAndCall(
    input: unknown | z.input<Input>,
    user?: User | null
  ): Promise<ServiceResult<Return>> {
    const parsed = this.input.safeParse(input)
    if (parsed.success) return this.call(parsed.data, user)
    return {
      success: false,
      errors: parsed.error.issues.map((issue) =>
        new AppError(
          'InvalidInput',
          issue.message,
          issue.path.pop() as string
        ).toJSON()
      )
    }
  }

  public async call(
    input?: z.input<Input>,
    user?: User | null
  ): Promise<ServiceResult<Return>> {
    try {
      return {
        success: true,
        data: await this._call(this.input.optional().parse(input), user)
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

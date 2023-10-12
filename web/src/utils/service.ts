import { authOptions } from 'app/api/auth/[...nextauth]/route'
import prisma, { User } from 'database'
import { getServerSession } from 'next-auth'
import { cache } from 'react'
import { AppError, AppErrorJSON } from 'src/services/utils/errors'
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

export class Service<Input extends z.ZodTypeAny, Return> {
  private _call: (input?: z.infer<Input>, user?: User | null) => Promise<Return>
  constructor(
    public input: Input,
    call: (input?: z.infer<Input>, user?: User | null) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {
    this._call = cache(call)
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
    const u = user || (await this.getUser())

    try {
      return {
        success: true,
        data: await this._call(this.input.optional().parse(input), u)
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        errors: [AppError.fromError(e).toJSON()]
      }
    }
  }

  private async getUser() {
    const session = await getServerSession(authOptions)

    if (!session?.user.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  }
}

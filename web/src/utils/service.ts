import { authOptions } from 'app/api/auth/[...nextauth]/route'
import prisma, { User } from 'database'
import { getServerSession } from 'next-auth'
import { cache } from 'react'
import { AppError, ErrorParser } from 'src/services/utils/errors'
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
      error?: never
    }
  | {
      success: false
      data?: never
      error: AppError
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

  public parseAndCall(input: unknown | z.infer<Input>, user?: User | null) {
    const parsed = this.input.parse(input)
    return this.call(parsed, user)
  }

  public async call(input?: z.infer<Input>, user?: User | null) {
    const u = user || (await this.getUser())

    try {
      return { success: true, data: await this._call(input, u) }
    } catch (e) {
      return {
        success: false,
        error: ErrorParser.fromError(e).toJSON(),
        originalError: e
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

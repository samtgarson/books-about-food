import { authOptions } from 'app/api/auth/[...nextauth]/route'
import prisma, { User } from 'database'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { cache } from 'react'

export type RequestMeta = {
  cache?: {
    maxAge?: number
    staleFor?: number
  }
  authorized?: boolean
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

    return this._call(input, u)
  }

  private async getUser() {
    const session = await getServerSession(authOptions)

    if (!session?.user.id) return null

    return prisma.user.findUnique({
      where: { id: session.user.id }
    })
  }
}

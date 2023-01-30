import { User } from 'database'
import { z } from 'zod'

export type RequestMeta = {
  maxAge?: number
  staleFor?: number
}

export class Service<Input extends z.ZodTypeAny, Return> {
  constructor(
    public input: Input,
    public call: (
      input?: z.infer<Input>,
      user?: User | null
    ) => Promise<Return>,
    public requestMeta: RequestMeta = {}
  ) {}

  public parseAndCall(input: unknown, user?: User | null) {
    const parsed = this.input.parse(input)
    return this.call(parsed, user)
  }
}

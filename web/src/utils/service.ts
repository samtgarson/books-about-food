import { z } from 'zod'

export class Service<Input extends z.ZodTypeAny, Return> {
  constructor(
    public input: Input,
    public call: (input?: z.infer<Input>) => Promise<Return>
  ) {}

  public parseAndCall(input: unknown) {
    const parsed = this.input.parse(input)
    return this.call(parsed)
  }
}

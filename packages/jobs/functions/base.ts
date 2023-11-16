import { GetEvents, GetFunctionInput } from 'inngest'
import { inngest } from '..'

type JobResult = { success: boolean; message?: string; data?: unknown }
type JobOptions = Parameters<typeof inngest.createFunction>[0]
type JobTrigger = Parameters<typeof inngest.createFunction>[1]

export function createJob<K extends keyof GetEvents<typeof inngest>>(
  { id, name }: JobOptions,
  event: K | JobTrigger,
  handler: (input: GetFunctionInput<typeof inngest, K>) => Promise<JobResult>
) {
  const options = typeof event === 'string' ? { event } : event

  return inngest.createFunction({ id, name }, options, async (params) => {
    console.log(`Running job ${id} for event ${params.event.name}`)
    try {
      const result = await handler(
        params as GetFunctionInput<typeof inngest, K>
      )
      console.log(`Job ${id} for event ${params.event.name} finished`)
      return { event, result }
    } catch (error) {
      console.error(
        `Error running job ${id} for event ${params.event.name}: `,
        error
      )
      return {
        event,
        result: { success: false, message: (error as Error).message }
      }
    }
  })
}

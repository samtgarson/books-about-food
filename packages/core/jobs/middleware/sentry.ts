import * as Sentry from '@sentry/nextjs'
import { InngestMiddleware } from 'inngest'

export const createSentryMiddleware = (dsn: string) =>
  new InngestMiddleware({
    name: 'Sentry Middleware',
    init({ client }) {
      Sentry.init({ dsn })

      Sentry.setTag('inngest.client.id', client.id)

      return {
        onFunctionRun({ ctx, fn }) {
          // Add specific context for the given function run
          Sentry.setTags({
            'inngest.function.id': fn.id(client.id),
            'inngest.function.name': fn.name,
            'inngest.event': ctx.event.name,
            'inngest.run.id': ctx.runId
          })

          // Start a transaction for this run
          const transaction = Sentry.startTransaction({
            name: 'Inngest Function Run',
            op: 'run',
            data: ctx.event
          })

          let memoSpan: ReturnType<typeof transaction.startChild>
          let execSpan: ReturnType<typeof transaction.startChild>

          return {
            transformInput() {
              return {
                ctx: {
                  // Add the Sentry client to the input arg so our
                  // functions can use it directly too
                  sentry: Sentry.getCurrentHub()
                }
              }
            },
            beforeMemoization() {
              // Track different spans for memoization and execution
              memoSpan = transaction.startChild({ op: 'memoization' })
            },
            afterMemoization() {
              memoSpan.finish()
            },
            beforeExecution() {
              execSpan = transaction.startChild({ op: 'execution' })
            },
            afterExecution() {
              execSpan.finish()
            },
            transformOutput({ result, step }) {
              // Capture step output and log errors
              if (step) {
                Sentry.setTags({
                  'inngest.step.name': step.displayName,
                  'inngest.step.op': step.op
                })

                if (result.error) {
                  Sentry.captureException(result.error)
                }
              }
            },
            async beforeResponse() {
              // Finish the transaction and flush data to Sentry before the
              // request closes
              transaction.finish()
              await Sentry.flush()
            }
          }
        }
      }
    }
  })

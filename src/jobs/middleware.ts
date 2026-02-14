import { InngestMiddleware } from 'inngest'
import { getPayloadClient } from 'src/core/services/utils/payload'

export const payloadMiddleware = new InngestMiddleware({
  name: 'Payload',
  init() {
    return {
      onFunctionRun() {
        return {
          async transformInput() {
            const payload = await getPayloadClient()
            return { ctx: { payload } }
          }
        }
      }
    }
  }
})
